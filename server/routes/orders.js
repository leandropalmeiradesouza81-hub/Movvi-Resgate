import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { calculatePrice, haversineDistance } from '../services/geo.js';
import { startMatching, cancelMatching } from '../services/matching.js';
import { Order, Client, Driver, WalletTransaction, Setting } from '../models.js';

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

    const activeStatuses = ['searching', 'accepted', 'assigned', 'arrived', 'in_progress', 'pickup'];
    const existingActive = await Order.findOne({ clientId, status: { $in: activeStatuses } });
    if (existingActive) {
        return res.status(409).json({ error: 'Você já tem um pedido em andamento.' });
    }

    const distanceKm = destinationLat && destinationLon
        ? haversineDistance(pickupLat, pickupLon, destinationLat, destinationLon)
        : 10;

    const pricingSetting = await Setting.findOne({ key: 'pricing' });
    const price = calculatePrice(pricingSetting.value, serviceType, distanceKm);

    const clientRecord = await Client.findOne({ id: clientId });
    const order = await Order.create({
        id: uuid(),
        clientId,
        clientName: clientName || 'Cliente',
        clientPhone: clientRecord?.phone || '',
        clientPhoto: clientRecord?.photo || '',
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
        driverPrice: price,
        status: 'searching'
    });

    req.io.to('admin').emit('order:new', order);
    startMatching(req.io, req.db, order);

    res.status(201).json(order);
});

router.get('/', async (req, res) => {
    const { clientId, driverId, status } = req.query;
    let query = {};
    if (clientId) query.clientId = clientId;
    if (driverId) query.driverId = driverId;
    if (status) query.status = { $in: status.split(',') };

    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json(orders);
});

router.get('/:id', async (req, res) => {
    const order = await Order.findOne({ id: req.params.id });
    if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });
    res.json(order);
});

router.put('/:id/status', async (req, res) => {
    const { status } = req.body;
    const order = await Order.findOne({ id: req.params.id });
    if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });

    order.status = status;

    if (status === 'completed' && !order.completedAt) {
        order.completedAt = new Date().toISOString();
        const driver = await Driver.findOne({ id: order.driverId });
        if (driver) {
            driver.activeOrderId = null;
            driver.totalOrders += 1;
            driver.totalEarnings += order.driverPrice || order.price;

            const feeValue = Math.round(((order.driverPrice || order.price) * 0.15) * 100) / 100;
            driver.walletBalance = Math.round(( (driver.walletBalance || 0) - feeValue) * 100) / 100;

            await WalletTransaction.create({
                id: uuid(),
                driverId: driver.id,
                orderId: order.id,
                type: 'fee',
                description: `Taxa da plataforma (15%) - Pedido #${order.id.slice(0, 8)}`,
                amount: -feeValue,
                balanceAfter: driver.walletBalance
            });

            if (driver.walletBalance <= -50) {
                driver.online = false;
                driver.blocked = true;
                driver.blockingReason = 'Bloqueado por Débito';
            }
            await driver.save();
        }
        await Client.updateOne({ id: order.clientId }, { $inc: { totalOrders: 1 } });
    }

    if (status === 'cancelled') {
        order.cancelledAt = new Date().toISOString();
        cancelMatching(req.io, order.id);
        if (order.driverId) {
            await Driver.updateOne({ id: order.driverId }, { $set: { activeOrderId: null } });
        }
    }

    await order.save();
    req.io.to(`client_${order.clientId}`).emit('order:status', { orderId: order.id, status });
    if (order.driverId) {
        req.io.to(`driver_${order.driverId}`).emit('order:status', { orderId: order.id, status });
    }
    req.io.to('admin').emit('order:updated', order);
    res.json(order);
});

router.put('/:id/rate', async (req, res) => {
    const { rating, ratedBy } = req.body;
    const order = await Order.findOne({ id: req.params.id });
    if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });

    if (ratedBy === 'client') {
        order.rating = rating;
        const driver = await Driver.findOne({ id: order.driverId });
        if (driver) {
            const driverOrders = await Order.find({ driverId: driver.id, rating: { $ne: null } });
            const avg = driverOrders.reduce((sum, o) => sum + o.rating, 0) / driverOrders.length;
            driver.rating = Math.round(avg * 10) / 10;
            await driver.save();
        }
    } else {
        order.driverRating = rating;
        const client = await Client.findOne({ id: order.clientId });
        if (client) {
            const clientOrders = await Order.find({ clientId: client.id, driverRating: { $ne: null } });
            const avg = clientOrders.reduce((sum, o) => sum + o.driverRating, 0) / clientOrders.length;
            client.rating = Math.round(avg * 10) / 10;
            await client.save();
        }
    }

    await order.save();
    res.json(order);
});

export default router;
