import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { calculatePrice, haversineDistance } from '../services/geo.js';
import { startMatching, cancelMatching } from '../services/matching.js';

const router = Router();

router.post('/', async (req, res) => {
    const {
        clientId, clientName, serviceType, serviceName,
        pickupAddress, pickupLat, pickupLon,
        destinationAddress, destinationLat, destinationLon,
        vehicleModel, vehiclePlate, problemDescription
    } = req.body;

    if (!clientId || !serviceType || !pickupLat || !pickupLon) {
        return res.status(400).json({ error: 'Dados obrigatórios faltando' });
    }

    // Block new orders if client already has an active one
    const activeStatuses = ['searching', 'accepted', 'assigned', 'arrived', 'in_progress', 'pickup'];
    const existingActive = req.db.data.orders.find(o => o.clientId === clientId && activeStatuses.includes(o.status));
    if (existingActive) {
        return res.status(409).json({ error: 'Você já tem um pedido em andamento.' });
    }

    const distanceKm = destinationLat && destinationLon
        ? haversineDistance(pickupLat, pickupLon, destinationLat, destinationLon)
        : 10;

    const price = calculatePrice(req.db.data.pricing, serviceType, distanceKm);
    const driverPrice = price;

    const clientRecord = req.db.data.clients.find(c => c.id === clientId);
    const order = {
        id: uuid(),
        clientId,
        clientName: clientName || 'Cliente',
        clientPhone: clientRecord?.phone || '',
        clientPhoto: clientRecord?.photo || '',
        driverId: null,
        driverName: null,
        serviceType,
        serviceName: serviceName || serviceType,
        pickupAddress: pickupAddress || '',
        pickupLat, pickupLon,
        destinationAddress: destinationAddress || '',
        destinationLat: destinationLat || null,
        destinationLon: destinationLon || null,
        vehicleModel: vehicleModel || '',
        vehiclePlate: vehiclePlate || '',
        problemDescription: problemDescription || '',
        distanceKm: Math.round(distanceKm * 10) / 10,
        price,
        driverPrice,
        status: 'searching',
        rating: null,
        driverRating: null,
        createdAt: new Date().toISOString(),
        acceptedAt: null,
        completedAt: null,
        cancelledAt: null
    };

    req.db.data.orders.push(order);
    await req.db.write();

    req.io.to('admin').emit('order:new', order);

    startMatching(req.io, req.db, order);

    res.status(201).json(order);
});

router.get('/', (req, res) => {
    const { clientId, driverId, status } = req.query;
    let orders = req.db.data.orders;
    if (clientId) orders = orders.filter(o => o.clientId === clientId);
    if (driverId) orders = orders.filter(o => o.driverId === driverId);
    if (status) {
        const statusList = status.split(',');
        orders = orders.filter(o => statusList.includes(o.status));
    }
    res.json(orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

router.get('/:id', (req, res) => {
    const order = req.db.data.orders.find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });
    res.json(order);
});

router.put('/:id/status', async (req, res) => {
    const { status } = req.body;
    const order = req.db.data.orders.find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });

    order.status = status;

    if (status === 'completed' && !order.completedAt) {
        order.completedAt = new Date().toISOString();
        const driver = req.db.data.drivers.find(d => d.id === order.driverId);
        if (driver) {
            driver.activeOrderId = null;
            driver.totalOrders += 1;
            driver.totalEarnings += (order.driverPrice || order.price);

            // 💰 Billing Logic: 15% platform fee
            const driverEarnings = order.driverPrice || order.price;
            const feeValue = Math.round((driverEarnings * 0.15) * 100) / 100;
            const currentBal = driver.walletBalance || 0;
            driver.walletBalance = Math.round((currentBal - feeValue) * 100) / 100;

            // Record Wallet Transaction
            if (!req.db.data.walletTransactions) req.db.data.walletTransactions = [];
            req.db.data.walletTransactions.push({
                id: uuid(),
                driverId: driver.id,
                orderId: order.id,
                type: 'fee',
                description: `Taxa da plataforma (15%) - Pedido #${order.id.slice(0, 8)}`,
                amount: -feeValue,
                orderValue: driverEarnings,
                balanceAfter: driver.walletBalance,
                createdAt: new Date().toISOString()
            });

            // 🛑 Safety Trigger: Block if balance <= -50
            if (driver.walletBalance <= -50) {
                driver.online = false;
                driver.blocked = true;
                driver.blockingReason = 'Bloqueado por Débito';
            }
        }
        const client = req.db.data.clients.find(c => c.id === order.clientId);
        if (client) client.totalOrders += 1;
    }

    if (status === 'cancelled') {
        order.cancelledAt = new Date().toISOString();
        cancelMatching(req.io, order.id);
        const driver = req.db.data.drivers.find(d => d.id === order.driverId);
        if (driver) driver.activeOrderId = null;
    }

    await req.db.write();
    req.io.to(`client_${order.clientId}`).emit('order:status', { orderId: order.id, status });
    if (order.driverId) {
        req.io.to(`driver_${order.driverId}`).emit('order:status', { orderId: order.id, status });
    }
    req.io.to('admin').emit('order:updated', order);
    res.json(order);
});

router.put('/:id/rate', async (req, res) => {
    const { rating, ratedBy } = req.body;
    const order = req.db.data.orders.find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });

    if (ratedBy === 'client') {
        order.rating = rating;
        const driver = req.db.data.drivers.find(d => d.id === order.driverId);
        if (driver) {
            const driverOrders = req.db.data.orders.filter(o => o.driverId === driver.id && o.rating);
            const avg = driverOrders.reduce((sum, o) => sum + o.rating, 0) / driverOrders.length;
            driver.rating = Math.round(avg * 10) / 10;
        }
    } else {
        order.driverRating = rating;
        const client = req.db.data.clients.find(c => c.id === order.clientId);
        if (client) {
            const clientOrders = req.db.data.orders.filter(o => o.clientId === client.id && o.driverRating);
            const avg = clientOrders.reduce((sum, o) => sum + o.driverRating, 0) / clientOrders.length;
            client.rating = Math.round(avg * 10) / 10;
        }
    }

    await req.db.write();
    res.json(order);
});

export default router;
