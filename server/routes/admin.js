import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { Driver, Client, Order, WalletTransaction } from '../models.js';

const router = Router();

router.get('/dashboard', async (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const startDate = new Date(today);
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 1);

    const [
        totalOrdersCount,
        todayOrdersCount,
        orders,
        drivers,
        totalClientsCount,
        walletTransactions
    ] = await Promise.all([
        Order.countDocuments(),
        Order.countDocuments({ createdAt: { $gte: startDate, $lt: endDate } }),
        Order.find(),
        Driver.find(),
        Client.countDocuments(),
        WalletTransaction.find()
    ]);

    const activeOrdersCount = orders.filter(o => ['searching', 'accepted', 'pickup', 'in_progress'].includes(o.status)).length;
    const completedOrders = orders.filter(o => o.status === 'completed');
    const totalServiceVolume = completedOrders.reduce((sum, o) => sum + (o.price || 0), 0);

    const totalPlatformRevenue = walletTransactions
        .filter(t => t.type === 'fee')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const todayPlatformRevenue = walletTransactions
        .filter(t => t.type === 'fee' && t.createdAt >= startDate && t.createdAt < endDate)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const totalDriverDebt = drivers.reduce((sum, d) => sum + (d.walletBalance < 0 ? Math.abs(d.walletBalance) : 0), 0);

    res.json({
        totalOrders: totalOrdersCount,
        todayOrders: todayOrdersCount,
        activeOrders: activeOrdersCount,
        completedOrders: completedOrders.length,
        cancelledOrders: orders.filter(o => o.status === 'cancelled').length,
        totalDrivers: drivers.length,
        onlineDrivers: drivers.filter(d => d.online).length,
        totalClients: totalClientsCount,
        totalRevenue: totalServiceVolume,
        totalPlatformRevenue,
        totalDriverEarnings: totalServiceVolume - totalPlatformRevenue,
        todayPlatformRevenue,
        todayRevenue: orders.filter(o => o.status === 'completed' && o.createdAt >= startDate && o.createdAt < endDate).reduce((sum, o) => sum + (o.price || 0), 0),
        totalDriverDebt,
        blockedDrivers: drivers.filter(d => d.blocked).length
    });
});

router.get('/clients', async (req, res) => {
    const clients = await Client.find({}, '-password');
    res.json(clients);
});

router.delete('/clients/:id', async (req, res) => {
    const result = await Client.deleteOne({ id: req.params.id });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Cliente não encontrado' });
    res.json({ success: true });
});

router.get('/orders', async (req, res) => {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
});

router.get('/live', async (req, res) => {
    const [drivers, clients, activeOrders] = await Promise.all([
        Driver.find({ latitude: { $ne: 0 }, longitude: { $ne: 0 } }, '-password'),
        Client.find({ latitude: { $ne: 0 }, longitude: { $ne: 0 } }, '-password'),
        Order.find({ status: { $in: ['searching', 'accepted', 'pickup', 'in_progress'] } })
    ]);
    res.json({ drivers, clients, orders: activeOrders });
});

router.put('/drivers/:id/approve', async (req, res) => {
    const driver = await Driver.findOne({ id: req.params.id });
    if (!driver) return res.status(404).json({ error: 'Motorista não encontrado' });

    driver.approved = true;
    driver.onboardingStep = 'approved_pending_kit';
    
    // Set 7-day deadline for kit payment
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 7);
    driver.kitPaymentDeadline = deadline;
    
    await driver.save();

    if (req.io) {
        req.io.to(`driver_${driver.id}`).emit('driver:data-updated', {
            approved: true
        });

        // Broadcast spots update to all (for invitation page real-time sync)
        const settingsObj = await Setting.findOne({ key: 'settings' });
        const settings = settingsObj?.value || {};
        const approvedCount = await Driver.countDocuments({ approved: true });
        req.io.emit('spots:updated', {
            totalSpots: settings.totalSpotsPhase1 || 100,
            occupiedSpots: approvedCount
        });
    }

    res.json({ success: true, driver });
});

router.put('/drivers/:id/unblock', async (req, res) => {
    const driver = await Driver.findOne({ id: req.params.id });
    if (!driver) return res.status(404).json({ error: 'Motorista não encontrado' });

    driver.blocked = false;
    driver.blockingReason = '';
    await driver.save();

    if (req.io) {
        req.io.to(`driver_${driver.id}`).emit('driver:data-updated', {
            blocked: false,
            walletBalance: driver.walletBalance
        });
    }

    res.json({ success: true, driver });
});

router.put('/drivers/:id/reset-balance', async (req, res) => {
    const driver = await Driver.findOne({ id: req.params.id });
    if (!driver) return res.status(404).json({ error: 'Motorista não encontrado' });

    const amountToReset = Math.abs(driver.walletBalance || 0);
    driver.walletBalance = 0;
    driver.blocked = false;
    driver.blockingReason = '';

    await WalletTransaction.create({
        id: `admin-${Date.now()}`,
        driverId: driver.id,
        type: 'admin_adjustment',
        description: 'Ajuste Administrativo (Quitação de Débito)',
        amount: amountToReset,
        balanceAfter: 0
    });

    await driver.save();

    if (req.io) {
        req.io.to(`driver_${driver.id}`).emit('driver:data-updated', {
            blocked: false,
            walletBalance: 0
        });
    }

    res.json({ success: true, balance: 0 });
});

router.post('/drivers/:id/sync', async (req, res) => {
    const driver = await Driver.findOne({ id: req.params.id });
    if (!driver) return res.status(404).json({ error: 'Motorista não encontrado' });

    if (req.io) {
        req.io.to(`driver_${driver.id}`).emit('driver:data-updated', {
            blocked: driver.blocked,
            walletBalance: driver.walletBalance
        });
    }
    res.json({ success: true });
});

export default router;
