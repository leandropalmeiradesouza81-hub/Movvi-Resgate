import { acceptOrder, declineOrder } from '../services/matching.js';
import { v4 as uuid } from 'uuid';
import { Driver, Order, Client, ChatMessage, OrderMessage } from '../models.js';

async function cleanStaleOrders(driverId, io) {
    const driver = await Driver.findOne({ id: driverId });
    if (!driver || !driver.activeOrderId) return;

    const order = await Order.findOne({ id: driver.activeOrderId });
    if (!order) {
        console.log(`[Cleanup] Driver ${driverId}: activeOrderId aponta para pedido inexistente. Limpando.`);
        driver.activeOrderId = null;
        await driver.save();
        return;
    }

    const STALE_MINUTES = 30;
    const acceptedAt = order.acceptedAt ? new Date(order.acceptedAt) : new Date(order.createdAt);
    const minutesElapsed = (Date.now() - acceptedAt.getTime()) / 60000;

    if ((order.status === 'accepted' || order.status === 'pickup' || order.status === 'in_progress') && minutesElapsed > STALE_MINUTES) {
        console.log(`[Cleanup] Order ${order.id} está ${order.status} há ${Math.round(minutesElapsed)} min. Cancelando automaticamente.`);
        order.status = 'cancelled';
        order.cancelledAt = new Date().toISOString();
        await order.save();
        
        driver.activeOrderId = null;
        await driver.save();
        
        io.to(`client_${order.clientId}`).emit('order:status', { orderId: order.id, status: 'cancelled' });
        io.to('admin').emit('order:updated', order);
    }
}

export function setupSocketHandlers(io) {
    io.on('connection', (socket) => {
        console.log(`[Socket] Connected: ${socket.id}`);

        socket.on('register:client', (clientId) => {
            socket.join(`client_${clientId}`);
            socket.clientId = clientId;
            socket.userType = 'client';
            console.log(`[Socket] Client registered: ${clientId}`);
        });

        socket.on('register:driver', async (driverId) => {
            socket.join(`driver_${driverId}`);
            socket.driverId = driverId;
            socket.userType = 'driver';
            console.log(`[Socket] Driver registered: ${driverId}`);
            await cleanStaleOrders(driverId, io);
        });

        socket.on('register:admin', () => {
            socket.join('admin');
            socket.userType = 'admin';
            console.log(`[Socket] Admin connected`);
        });

        socket.on('driver:online', async (driverId) => {
            const driver = await Driver.findOne({ id: driverId });
            if (driver) {
                if (driver.walletBalance <= -50) {
                    driver.online = false;
                    driver.blocked = true;
                    driver.blockingReason = 'Bloqueado por Débito de Taxas';
                    await driver.save();
                    socket.emit('driver:online:error', {
                        error: 'DEBT_BLOCK',
                        balance: driver.walletBalance,
                        message: 'Seu saldo está abaixo do limite permitido (-R$ 50,00). Regularize sua conta para voltar a ficar online.'
                    });
                    return;
                }
                driver.online = true;
                await cleanStaleOrders(driverId, io);
                await driver.save();
                io.to('admin').emit('driver:status', { driverId, online: true });
                console.log(`[Socket] Driver ${driverId} is ONLINE.`);
            }
        });

        socket.on('driver:offline', async (driverId) => {
            const driver = await Driver.findOne({ id: driverId });
            if (driver) {
                driver.online = false;
                await driver.save();
                io.to('admin').emit('driver:status', { driverId, online: false });
            }
        });

        socket.on('driver:location', async ({ driverId, latitude, longitude }) => {
            const driver = await Driver.findOne({ id: driverId });
            if (driver) {
                driver.latitude = latitude;
                driver.longitude = longitude;
                await driver.save();

                if (driver.activeOrderId) {
                    const order = await Order.findOne({ id: driver.activeOrderId });
                    if (order) {
                        io.to(`client_${order.clientId}`).emit('driver:location', {
                            driverId, latitude, longitude
                        });
                    }
                }
                io.to('admin').emit('driver:location', { driverId, latitude, longitude });
            }
        });

        socket.on('client:location', async ({ clientId, latitude, longitude }) => {
            await Client.updateOne({ id: clientId }, { $set: { latitude, longitude } });
            io.to('admin').emit('client:location', { clientId, latitude, longitude });
        });

        socket.on('driver:eta', ({ orderId, clientId, etaMinutes, distanceKm }) => {
            io.to(`client_${clientId}`).emit('driver:eta', { orderId, etaMinutes, distanceKm });
        });

        socket.on('order:accept', async ({ driverId, orderId }) => {
            const success = await acceptOrder(io, driverId, orderId);
            if (success) {
                socket.emit('order:accept:result', { success: true, orderId });
            } else {
                socket.emit('order:accept:result', { success: false, orderId });
            }
        });

        socket.on('order:decline', ({ driverId, orderId }) => {
            declineOrder(io, driverId, orderId);
        });

        socket.on('order:arrived', async ({ orderId }) => {
            const order = await Order.findOne({ id: orderId });
            if (order) {
                order.status = 'pickup';
                await order.save();
                io.to(`client_${order.clientId}`).emit('order:status', { orderId, status: 'pickup' });
                io.to('admin').emit('order:updated', order);
            }
        });

        socket.on('order:start', async ({ orderId }) => {
            const order = await Order.findOne({ id: orderId });
            if (order) {
                order.status = 'in_progress';
                await order.save();
                io.to(`client_${order.clientId}`).emit('order:status', { orderId, status: 'in_progress' });
                io.to('admin').emit('order:updated', order);
            }
        });

        socket.on('order:complete', async ({ orderId }) => {
            const order = await Order.findOne({ id: orderId });
            if (order) {
                order.status = 'completed';
                order.completedAt = new Date().toISOString();
                // Logic updated in orders.js status put route too, but keep here for socket legacy
                // Actually better to centralize completion logic. For now, matching the sync.
                await order.save();
                io.to(`client_${order.clientId}`).emit('order:status', { orderId, status: 'completed' });
                io.to(`driver_${order.driverId}`).emit('order:status', { orderId, status: 'completed' });
                io.to('admin').emit('order:updated', order);
            }
        });

        socket.on('chat:driver-to-admin', async ({ driverId, driverName, message, file }) => {
            const msg = await ChatMessage.create({
                id: Date.now().toString(),
                from: 'driver',
                driverId,
                driverName,
                message: message || '',
                file: file || null,
                read: false
            });
            io.to('admin').emit('chat:new-message', msg);
            socket.emit('chat:sent', msg);
        });

        socket.on('chat:admin-to-driver', async ({ driverId, message, file }) => {
            const msg = await ChatMessage.create({
                id: Date.now().toString(),
                from: 'admin',
                driverId,
                message: message || '',
                file: file || null,
                read: false
            });
            io.to(`driver_${driverId}`).emit('chat:new-message', msg);
            socket.emit('chat:sent', msg);
        });

        socket.on('chat:get-history', async ({ driverId }) => {
            const history = await ChatMessage.find({ driverId }).sort({ timestamp: 1 }).limit(50);
            socket.emit('chat:history', { driverId, messages: history });
        });

        socket.on('chat:get-conversations', async () => {
            const messages = await ChatMessage.find().sort({ timestamp: 1 });
            const convMap = {};
            for (const m of messages) {
                if (!convMap[m.driverId]) convMap[m.driverId] = { driverId: m.driverId, driverName: m.driverName || 'Motorista', lastMessage: m.message, lastTimestamp: m.timestamp, unread: 0 };
                convMap[m.driverId].lastMessage = m.message;
                convMap[m.driverId].lastTimestamp = m.timestamp;
                if (m.driverName) convMap[m.driverId].driverName = m.driverName;
                if (m.from === 'driver' && !m.read) convMap[m.driverId].unread++;
            }
            socket.emit('chat:conversations', Object.values(convMap).sort((a, b) => b.lastTimestamp - a.lastTimestamp));
        });

        socket.on('order-chat:client-to-driver', async ({ orderId, driverId, clientId, message, type, audioData }) => {
            const msg = await OrderMessage.create({ id: Date.now().toString(), orderId, from: 'client', driverId, clientId, message: message || '', type: type || 'text', audioData: audioData || null });
            io.to(`driver_${driverId}`).emit('order-chat:new-message', msg);
        });

        socket.on('order-chat:driver-to-client', async ({ orderId, driverId, clientId, message, type, audioData }) => {
            const msg = await OrderMessage.create({ id: Date.now().toString(), orderId, from: 'driver', driverId, clientId, message: message || '', type: type || 'text', audioData: audioData || null });
            io.to(`client_${clientId}`).emit('order-chat:new-message', msg);
        });

        socket.on('order-chat:get-history', async ({ orderId }) => {
            const history = await OrderMessage.find({ orderId });
            socket.emit('order-chat:history', { orderId, messages: history });
        });

        socket.on('disconnect', async () => {
            if (socket.userType === 'driver' && socket.driverId) {
                await Driver.updateOne({ id: socket.driverId }, { $set: { online: false } });
                io.to('admin').emit('driver:status', { driverId: socket.driverId, online: false });
            }
            console.log(`[Socket] Disconnected: ${socket.id}`);
        });
    });
}
