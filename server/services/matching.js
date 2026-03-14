import { findNearestDrivers } from './geo.js';
import { Driver, Order, Setting } from '../models.js';

const activeMatches = new Map();

export async function startMatching(io, db, orderIdOrObj) {
    const orderId = typeof orderIdOrObj === 'string' ? orderIdOrObj : orderIdOrObj.id;
    const triedDrivers = [];
    const matchId = orderId;

    async function tryNextDriver() {
        const order = await Order.findOne({ id: orderId });
        if (!order || order.status !== 'searching') {
            activeMatches.delete(matchId);
            return;
        }

        console.log(`[Match] Searching for drivers for order ${orderId}...`);

        const allDrivers = await Driver.find({ online: true, activeOrderId: null, blocked: false });
        const drivers = findNearestDrivers(
            allDrivers,
            Number(order.pickupLat),
            Number(order.pickupLon),
            triedDrivers
        );

        if (drivers.length === 0) {
            console.log(`[Match] No drivers found for order ${orderId}. Retrying in 5s.`);
            triedDrivers.length = 0;
            setTimeout(() => tryNextDriver(), 5000);
            io.to(`client_${order.clientId}`).emit('order:searching', {
                orderId: order.id,
                message: 'Procurando motoristas disponíveis...'
            });
            return;
        }

        const driver = drivers[0];
        triedDrivers.push(driver.id);

        console.log(`[Match] Notifying driver ${driver.name} (${driver.id}) about order ${orderId}`);

        const settingsDoc = await Setting.findOne({ key: 'settings' });
        const matchTimeout = settingsDoc?.value?.matchTimeout || 15000;

        io.to(`driver_${driver.id}`).emit('order:incoming', {
            orderId: order.id,
            clientId: order.clientId,
            clientPhone: order.clientPhone || '',
            serviceType: order.serviceType,
            serviceName: order.serviceName,
            pickupAddress: order.pickupAddress,
            destinationAddress: order.destinationAddress,
            vehicleModel: order.vehicleModel,
            vehiclePlate: order.vehiclePlate,
            problemDescription: order.problemDescription,
            distanceKm: Math.max(0.1, Math.round(driver.distance * 10) / 10),
            price: order.price,
            driverPrice: order.driverPrice,
            clientName: order.clientName,
            clientPhoto: order.clientPhoto,
            pickupLat: order.pickupLat,
            pickupLon: order.pickupLon,
            timeout: matchTimeout
        });

        io.to(`client_${order.clientId}`).emit('order:searching', {
            orderId: order.id,
            message: `Motorista disponível encontrado. Enviando chamado...`
        });

        const timer = setTimeout(() => {
            if (activeMatches.has(matchId)) {
                console.log(`[Match] Driver ${driver.name} timed out for order ${orderId}. Trying next.`);
                io.to(`driver_${driver.id}`).emit('order:timeout', { orderId: order.id });
                tryNextDriver();
            }
        }, matchTimeout);

        activeMatches.set(matchId, { timer, currentDriverId: driver.id, order });
    }

    tryNextDriver();
}

export async function resumeAllMatching(io) {
    const searchingOrders = await Order.find({ status: 'searching' });
    if (searchingOrders.length > 0) {
        console.log(`[Match] Resuming matching for ${searchingOrders.length} orders...`);
        for (const order of searchingOrders) {
            startMatching(io, null, order);
        }
    }
}

export async function acceptOrder(io, driverId, orderId) {
    const match = activeMatches.get(orderId);
    const order = await Order.findOne({ id: orderId });
    const driver = await Driver.findOne({ id: driverId });

    if (!order || !driver) return false;
    if (order.status !== 'searching' && order.status !== 'accepted') return false;

    if (match) {
        clearTimeout(match.timer);
        activeMatches.delete(orderId);
    }

    order.status = 'accepted';
    order.driverId = driverId;
    order.driverName = driver.name;
    order.driverPhone = driver.phone;
    order.driverVehicle = driver.vehicle;
    order.driverPlate = driver.plate;
    order.driverRating = driver.rating;
    order.driverPhoto = driver.photo;
    order.driverLat = driver.latitude;
    order.driverLon = driver.longitude;
    order.driverPixKey = driver.pixKey; // Nova chave para pagamento direto
    order.acceptedAt = new Date().toISOString();

    await order.save();

    driver.activeOrderId = orderId;
    
    // Commission Logic for B2B (Direct Payment to Driver)
    if (order.metadata?.isB2B) {
        const commission = order.price * 0.15;
        const { WalletTransaction } = await import('../models.js');
        
        await WalletTransaction.create({
            id: uuid(),
            driverId: driver.id,
            amount: -commission,
            type: 'debit',
            description: `Comissão B2B (15%) - Pedido ${order.id.slice(0, 8)}`,
            orderId: order.id
        });

        driver.walletBalance = (driver.walletBalance || 0) - commission;
    }

    await driver.save();

    io.to(`client_${order.clientId}`).emit('order:accepted', order);
    io.to('admin').emit('order:updated', order);
    console.log(`[Match] Order ${orderId} accepted by driver ${driver.name}`);
    return true;
}

export function declineOrder(io, driverId, orderId) {
    const match = activeMatches.get(orderId);
    if (match) {
        clearTimeout(match.timer);
        activeMatches.delete(orderId);
    }
    // Restart matching immediately
    startMatching(io, null, orderId);
}

export function cancelMatching(io, orderId) {
    const match = activeMatches.get(orderId);
    if (match) {
        clearTimeout(match.timer);
        if (io && match.currentDriverId) {
            io.to(`driver_${match.currentDriverId}`).emit('order:timeout', { orderId });
        }
        activeMatches.delete(orderId);
    }
}
