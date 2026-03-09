import { acceptOrder, declineOrder } from '../services/matching.js';
import { v4 as uuid } from 'uuid';
async function cleanStaleOrders(db, driverId, io) {
    const driver = db.data.drivers.find(d => d.id === driverId);
    if (!driver) return;

    if (driver.activeOrderId) {
        const order = db.data.orders.find(o => o.id === driver.activeOrderId);
        if (!order) {
            // Pedido não existe mais, limpa
            console.log(`[Cleanup] Driver ${driverId}: activeOrderId aponta para pedido inexistente. Limpando.`);
            driver.activeOrderId = null;
            await db.write();
            return;
        }

        // Se o pedido foi aceito há mais de 30 minutos sem progredir, considera abandonado
        const STALE_MINUTES = 30;
        const acceptedAt = order.acceptedAt ? new Date(order.acceptedAt) : new Date(order.createdAt);
        const minutesElapsed = (Date.now() - acceptedAt.getTime()) / 60000;

        if ((order.status === 'accepted' || order.status === 'pickup' || order.status === 'in_progress') && minutesElapsed > STALE_MINUTES) {
            console.log(`[Cleanup] Order ${order.id} está ${order.status} há ${Math.round(minutesElapsed)} min. Cancelando automaticamente.`);
            order.status = 'cancelled';
            order.cancelledAt = new Date().toISOString();
            driver.activeOrderId = null;
            await db.write();
            io.to(`client_${order.clientId}`).emit('order:status', { orderId: order.id, status: 'cancelled' });
            io.to('admin').emit('order:updated', order);
        }
    }
}

export function setupSocketHandlers(io, db) {
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
            // Limpa pedidos fantasmas ao conectar
            await cleanStaleOrders(db, driverId, io);
        });

        socket.on('register:admin', () => {
            socket.join('admin');
            socket.userType = 'admin';
            console.log(`[Socket] Admin connected`);
        });

        socket.on('driver:online', async (driverId) => {
            const driver = db.data.drivers.find(d => d.id === driverId);
            if (driver) {
                if (driver.walletBalance <= -50) {
                    driver.online = false;
                    driver.blocked = true;
                    driver.blockingReason = 'Bloqueado por Débito de Taxas';
                    await db.write();
                    socket.emit('driver:online:error', {
                        error: 'DEBT_BLOCK',
                        balance: driver.walletBalance,
                        message: 'Seu saldo está abaixo do limite permitido (-R$ 50,00). Regularize sua conta para voltar a ficar online.'
                    });
                    return;
                }
                driver.online = true;
                // Limpa pedidos fantasmas ao ficar online
                await cleanStaleOrders(db, driverId, io);
                await db.write();
                io.to('admin').emit('driver:status', { driverId, online: true });
                console.log(`[Socket] Driver ${driverId} is ONLINE. activeOrder: ${driver.activeOrderId || 'NENHUM'}`);
            }
        });

        socket.on('driver:offline', async (driverId) => {
            const driver = db.data.drivers.find(d => d.id === driverId);
            if (driver) {
                driver.online = false;
                await db.write();
                io.to('admin').emit('driver:status', { driverId, online: false });
            }
        });

        socket.on('driver:location', async ({ driverId, latitude, longitude }) => {
            const driver = db.data.drivers.find(d => d.id === driverId);
            if (driver) {
                driver.latitude = latitude;
                driver.longitude = longitude;
                await db.write();

                if (driver.activeOrderId) {
                    const order = db.data.orders.find(o => o.id === driver.activeOrderId);
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
            const client = db.data.clients.find(c => c.id === clientId);
            if (client) {
                client.latitude = latitude;
                client.longitude = longitude;
            }
            io.to('admin').emit('client:location', { clientId, latitude, longitude });
        });

        socket.on('driver:eta', ({ orderId, clientId, etaMinutes, distanceKm }) => {
            io.to(`client_${clientId}`).emit('driver:eta', { orderId, etaMinutes, distanceKm });
        });

        socket.on('order:accept', async ({ driverId, orderId }) => {
            const success = acceptOrder(io, db, driverId, orderId);
            if (success) {
                socket.emit('order:accept:result', { success: true, orderId });
                console.log(`[Match] Driver ${driverId} accepted order ${orderId}`);
            } else {
                socket.emit('order:accept:result', { success: false, orderId });
            }
        });

        socket.on('order:decline', ({ driverId, orderId }) => {
            declineOrder(io, db, driverId, orderId);
            console.log(`[Match] Driver ${driverId} declined order ${orderId}`);
        });

        socket.on('order:arrived', async ({ orderId }) => {
            const order = db.data.orders.find(o => o.id === orderId);
            if (order) {
                order.status = 'pickup';
                await db.write();
                io.to(`client_${order.clientId}`).emit('order:status', { orderId, status: 'pickup' });
                io.to('admin').emit('order:updated', order);
            }
        });

        socket.on('order:start', async ({ orderId }) => {
            const order = db.data.orders.find(o => o.id === orderId);
            if (order) {
                order.status = 'in_progress';
                await db.write();
                io.to(`client_${order.clientId}`).emit('order:status', { orderId, status: 'in_progress' });
                io.to('admin').emit('order:updated', order);
            }
        });

        socket.on('order:complete', async ({ orderId }) => {
            const order = db.data.orders.find(o => o.id === orderId);
            if (order) {
                order.status = 'completed';
                order.completedAt = new Date().toISOString();
                const driver = db.data.drivers.find(d => d.id === order.driverId);
                if (driver) {
                    driver.activeOrderId = null;
                    driver.totalOrders += 1;
                    driver.totalEarnings += (order.driverPrice || order.price);

                    // 💰 Billing Logic: 15% platform fee
                    const driverEarnings = order.driverPrice || order.price;
                    const feeValue = Math.round((driverEarnings * 0.15) * 100) / 100;
                    const currentBal = driver.walletBalance || 0;
                    driver.walletBalance = Math.round((currentBal - feeValue) * 100) / 100;

                    if (!db.data.walletTransactions) db.data.walletTransactions = [];
                    db.data.walletTransactions.push({
                        id: uuid(),
                        driverId: driver.id,
                        orderId: order.id,
                        type: 'fee',
                        description: `Taxa (15%) - # ${order.serviceName} (${order.id.slice(0, 8)})`,
                        amount: -feeValue,
                        orderValue: driverEarnings,
                        balanceAfter: driver.walletBalance,
                        createdAt: new Date().toISOString()
                    });

                    // 🛑 Safety Trigger: Block if balance <= -50
                    if (driver.walletBalance <= -50) {
                        driver.online = false;
                        driver.blocked = true;
                        driver.blockingReason = 'Bloqueado por Débito de Taxas';
                        io.to('admin').emit('driver:status', { driverId: driver.id, online: false });
                    }
                }
                const client = db.data.clients.find(c => c.id === order.clientId);
                if (client) client.totalOrders += 1;
                await db.write();
                io.to(`client_${order.clientId}`).emit('order:status', { orderId, status: 'completed' });
                io.to(`driver_${order.driverId}`).emit('order:status', { orderId, status: 'completed' });
                io.to('admin').emit('order:updated', order);
            }
        });

        // ═══ SUPPORT CHAT ═══
        socket.on('chat:driver-to-admin', async ({ driverId, driverName, message, file }) => {
            if (!db.data.chatMessages) db.data.chatMessages = [];
            const msg = {
                id: Date.now().toString(),
                from: 'driver',
                driverId,
                driverName,
                message: message || '',
                file: file || null,
                timestamp: new Date().toISOString(),
                read: false
            };
            db.data.chatMessages.push(msg);
            await db.write();
            io.to('admin').emit('chat:new-message', msg);
            socket.emit('chat:sent', msg);
            console.log(`[Chat] Driver ${driverName} -> Admin: ${message || '[FILE]'}`);
        });

        socket.on('chat:admin-to-driver', async ({ driverId, message, file }) => {
            if (!db.data.chatMessages) db.data.chatMessages = [];
            const msg = {
                id: Date.now().toString(),
                from: 'admin',
                driverId,
                message: message || '',
                file: file || null,
                timestamp: new Date().toISOString(),
                read: false
            };
            db.data.chatMessages.push(msg);
            await db.write();
            io.to(`driver_${driverId}`).emit('chat:new-message', msg);
            socket.emit('chat:sent', msg);
            console.log(`[Chat] Admin -> Driver ${driverId}: ${message || '[FILE]'}`);
        });

        socket.on('chat:get-history', async ({ driverId }) => {
            if (!db.data.chatMessages) db.data.chatMessages = [];
            const history = db.data.chatMessages.filter(m => m.driverId === driverId).slice(-50);
            socket.emit('chat:history', { driverId, messages: history });
        });

        socket.on('chat:get-conversations', async () => {
            if (!db.data.chatMessages) db.data.chatMessages = [];
            const convMap = {};
            for (const m of db.data.chatMessages) {
                if (!convMap[m.driverId]) convMap[m.driverId] = { driverId: m.driverId, driverName: m.driverName || 'Motorista', lastMessage: m.message, lastTimestamp: m.timestamp, unread: 0 };
                convMap[m.driverId].lastMessage = m.message;
                convMap[m.driverId].lastTimestamp = m.timestamp;
                if (m.driverName) convMap[m.driverId].driverName = m.driverName;
                if (m.from === 'driver' && !m.read) convMap[m.driverId].unread++;
            }
            socket.emit('chat:conversations', Object.values(convMap).sort((a, b) => b.lastTimestamp.localeCompare(a.lastTimestamp)));
        });

        // ═══ DRIVER-CLIENT ORDER CHAT ═══
        socket.on('order-chat:client-to-driver', async ({ orderId, driverId, clientId, message, type, audioData }) => {
            if (!db.data.orderMessages) db.data.orderMessages = [];
            const msg = { id: Date.now().toString(), orderId, from: 'client', driverId, clientId, message: message || '', type: type || 'text', audioData: audioData || null, timestamp: new Date().toISOString() };
            db.data.orderMessages.push(msg);
            await db.write();
            io.to(`driver_${driverId}`).emit('order-chat:new-message', msg);
            console.log(`[OrderChat] Client ${clientId} -> Driver ${driverId} (Order ${orderId}): ${type === 'audio' ? '[AUDIO]' : message}`);
        });

        socket.on('order-chat:driver-to-client', async ({ orderId, driverId, clientId, message, type, audioData }) => {
            if (!db.data.orderMessages) db.data.orderMessages = [];
            const msg = { id: Date.now().toString(), orderId, from: 'driver', driverId, clientId, message: message || '', type: type || 'text', audioData: audioData || null, timestamp: new Date().toISOString() };
            db.data.orderMessages.push(msg);
            await db.write();
            io.to(`client_${clientId}`).emit('order-chat:new-message', msg);
            console.log(`[OrderChat] Driver ${driverId} -> Client ${clientId} (Order ${orderId}): ${type === 'audio' ? '[AUDIO]' : message}`);
        });

        socket.on('order-chat:get-history', async ({ orderId }) => {
            if (!db.data.orderMessages) db.data.orderMessages = [];
            const history = db.data.orderMessages.filter(m => m.orderId === orderId);
            socket.emit('order-chat:history', { orderId, messages: history });
        });

        // ═══ WEB RTC SIGNALING (VOIP CALLS) ═══
        socket.on('call:request', ({ targetId, userId, callerName, callerPhoto }) => {
            io.to(`${socket.userType === 'client' ? 'driver' : 'client'}_${targetId}`).emit('call:incoming', {
                fromId: userId, callerName, callerPhoto
            });
        });

        socket.on('call:signal', ({ targetId, signal }) => {
            io.to(`${socket.userType === 'client' ? 'driver' : 'client'}_${targetId}`).emit('call:signal', { signal });
        });

        socket.on('call:accept', ({ targetId }) => {
            io.to(`${socket.userType === 'client' ? 'driver' : 'client'}_${targetId}`).emit('call:accepted');
        });

        socket.on('call:reject', ({ targetId }) => {
            io.to(`${socket.userType === 'client' ? 'driver' : 'client'}_${targetId}`).emit('call:rejected');
        });

        socket.on('call:end', ({ targetId }) => {
            io.to(`${socket.userType === 'client' ? 'driver' : 'client'}_${targetId}`).emit('call:ended');
        });

        socket.on('disconnect', async () => {
            if (socket.userType === 'driver' && socket.driverId) {
                const driver = db.data.drivers.find(d => d.id === socket.driverId);
                if (driver) {
                    driver.online = false;
                    await db.write();
                    io.to('admin').emit('driver:status', { driverId: socket.driverId, online: false });
                }
            }
            console.log(`[Socket] Disconnected: ${socket.id}`);
        });
    });
}
