import { findNearestDrivers } from './geo.js';

const activeMatches = new Map();

export function startMatching(io, db, order) {
    const triedDrivers = [];
    const matchId = order.id;

    async function tryNextDriver() {
        // Ensure order is still matching
        const currentOrder = db.data.orders.find(o => o.id === order.id);
        if (!currentOrder || currentOrder.status !== 'searching') {
            activeMatches.delete(matchId);
            return;
        }

        console.log(`[Match] Searching for drivers for order ${order.id}...`);

        const drivers = findNearestDrivers(
            db.data.drivers,
            Number(order.pickupLat),
            Number(order.pickupLon),
            triedDrivers
        );

        if (drivers.length === 0) {
            const onlineCount = db.data.drivers.filter(d => d.online).length;
            console.log(`[Match] No drivers found for order ${order.id}. Online total: ${onlineCount}. Retrying in 5s.`);

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

        console.log(`[Match] Notifying driver ${driver.name} (${driver.id}) about order ${order.id}`);

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
            timeout: db.data.settings.matchTimeout
        });

        io.to(`client_${order.clientId}`).emit('order:searching', {
            orderId: order.id,
            message: `Motorista disponível encontrado. Enviando chamado...`
        });

        const timer = setTimeout(() => {
            if (activeMatches.has(matchId)) {
                console.log(`[Match] Driver ${driver.name} timed out for order ${order.id}. Trying next.`);
                io.to(`driver_${driver.id}`).emit('order:timeout', { orderId: order.id });
                tryNextDriver();
            }
        }, db.data.settings.matchTimeout);

        activeMatches.set(matchId, { timer, currentDriverId: driver.id, order });
    }

    tryNextDriver();
}

export function resumeAllMatching(io, db) {
    if (!db.data.orders) return;
    const searchingOrders = db.data.orders.filter(o => o.status === 'searching');
    if (searchingOrders.length > 0) {
        console.log(`[Match] Resuming matching for ${searchingOrders.length} orders...`);
        searchingOrders.forEach(order => startMatching(io, db, order));
    }
}

export function acceptOrder(io, db, driverId, orderId) {
    const match = activeMatches.get(orderId);
    // Even if not in activeMatches (server restart), we should allow acceptance if order exists
    const order = db.data.orders.find(o => o.id === orderId);
    const driver = db.data.drivers.find(d => d.id === driverId);

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
    order.acceptedAt = new Date().toISOString();

    driver.activeOrderId = orderId;
    db.write();

    io.to(`client_${order.clientId}`).emit('order:accepted', order);
    io.to('admin').emit('order:updated', order);
    console.log(`[Match] Order ${orderId} accepted by driver ${driver.name}`);
    return true;
}

export function declineOrder(io, db, driverId, orderId) {
    const match = activeMatches.get(orderId);
    if (match) {
        clearTimeout(match.timer);
        activeMatches.delete(orderId);
    }

    const order = db.data.orders.find(o => o.id === orderId);
    if (!order || order.status !== 'searching') return;

    // Restart matching immediately for this order
    startMatching(io, db, order);
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
