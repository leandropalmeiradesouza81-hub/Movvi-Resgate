import { Router } from 'express';

const router = Router();

router.get('/dashboard', (req, res) => {
    const { orders, drivers, clients, walletTransactions = [] } = req.db.data;
    const today = new Date().toISOString().split('T')[0];
    const todayOrders = orders.filter(o => o.createdAt?.startsWith(today));

    // RRL Calculations (Revenue, Receiving, Ledger)
    const completedOrders = orders.filter(o => o.status === 'completed');
    const totalServiceVolume = completedOrders.reduce((sum, o) => sum + (o.price || 0), 0);

    // Platform Revenue = Total 15% fees collected (sum of negative fee transactions)
    const totalPlatformRevenue = walletTransactions
        .filter(t => t.type === 'fee')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const todayPlatformRevenue = walletTransactions
        .filter(t => t.type === 'fee' && t.createdAt?.startsWith(today))
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const totalDriverDebt = drivers.reduce((sum, d) => sum + (d.walletBalance < 0 ? Math.abs(d.walletBalance) : 0), 0);

    res.json({
        totalOrders: orders.length,
        todayOrders: todayOrders.length,
        activeOrders: orders.filter(o => ['searching', 'accepted', 'pickup', 'in_progress'].includes(o.status)).length,
        completedOrders: completedOrders.length,
        cancelledOrders: orders.filter(o => o.status === 'cancelled').length,
        totalDrivers: drivers.length,
        onlineDrivers: drivers.filter(d => d.online).length,
        totalClients: clients.length,
        // Financials (RRL)
        totalRevenue: totalServiceVolume,
        totalPlatformRevenue,
        totalDriverEarnings: totalServiceVolume - totalPlatformRevenue,
        todayPlatformRevenue,
        todayRevenue: todayOrders.filter(o => o.status === 'completed').reduce((sum, o) => sum + (o.price || 0), 0),
        totalDriverDebt,
        blockedDrivers: drivers.filter(d => d.blocked).length
    });
});

router.get('/clients', (req, res) => {
    const clients = req.db.data.clients.map(({ password, ...c }) => c);
    res.json(clients);
});

router.delete('/clients/:id', async (req, res) => {
    const idx = req.db.data.clients.findIndex(c => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Cliente não encontrado' });
    req.db.data.clients.splice(idx, 1);
    await req.db.write();
    res.json({ success: true });
});

router.get('/orders', (req, res) => {
    const orders = req.db.data.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(orders);
});

router.get('/live', (req, res) => {
    const drivers = req.db.data.drivers
        .filter(d => d.latitude && d.longitude)
        .map(({ password, ...d }) => d);

    const clients = (req.db.data.clients || [])
        .filter(c => c.latitude && c.longitude)
        .map(({ password, ...c }) => c);

    const activeOrders = req.db.data.orders.filter(o =>
        ['searching', 'accepted', 'pickup', 'in_progress'].includes(o.status)
    );
    res.json({ drivers, clients, orders: activeOrders });
});

router.put('/drivers/:id/approve', async (req, res) => {
    const driver = req.db.data.drivers.find(d => d.id === req.params.id);
    if (!driver) return res.status(404).json({ error: 'Motorista não encontrado' });

    driver.approved = true;
    driver.status = 'offline';
    await req.db.write();

    const io = req.io;
    if (io) {
        io.to(`driver_${driver.id}`).emit('driver:data-updated', {
            approved: true,
            status: 'offline'
        });
    }

    res.json({ success: true, driver });
});

router.put('/drivers/:id/unblock', async (req, res) => {
    const driver = req.db.data.drivers.find(d => d.id === req.params.id);
    if (!driver) return res.status(404).json({ error: 'Motorista não encontrado' });

    driver.blocked = false;
    driver.blockingReason = '';
    // Optional: If unblocking, we usually expect the debt to be paid. 
    // If the admin manually unblocks, we keep the balance unless they use reset-balance.

    await req.db.write();

    // Notify driver client to refresh data
    const io = req.io;
    if (io) {
        io.to(`driver_${driver.id}`).emit('driver:data-updated', {
            blocked: false,
            walletBalance: driver.walletBalance
        });
    }

    res.json({ success: true, driver });
});

router.put('/drivers/:id/reset-balance', async (req, res) => {
    const driver = req.db.data.drivers.find(d => d.id === req.params.id);
    if (!driver) return res.status(404).json({ error: 'Motorista não encontrado' });

    const amountToReset = Math.abs(driver.walletBalance || 0);
    driver.walletBalance = 0;
    driver.blocked = false;
    driver.blockingReason = '';

    if (!req.db.data.walletTransactions) req.db.data.walletTransactions = [];
    req.db.data.walletTransactions.push({
        id: `admin-${Date.now()}`,
        driverId: driver.id,
        type: 'admin_adjustment',
        description: 'Ajuste Administrativo (Quitação de Débito)',
        amount: amountToReset,
        balanceAfter: 0,
        createdAt: new Date().toISOString()
    });

    await req.db.write();

    // Notify driver client to refresh data
    const io = req.io;
    if (io) {
        io.to(`driver_${driver.id}`).emit('driver:data-updated', {
            blocked: false,
            walletBalance: 0
        });
    }

    res.json({ success: true, balance: 0 });
});

router.post('/drivers/:id/sync', async (req, res) => {
    const driver = req.db.data.drivers.find(d => d.id === req.params.id);
    if (!driver) return res.status(404).json({ error: 'Motorista não encontrado' });

    const io = req.io;
    if (io) {
        io.to(`driver_${driver.id}`).emit('driver:data-updated', {
            blocked: driver.blocked,
            walletBalance: driver.walletBalance
        });
    }
    res.json({ success: true });
});

export default router;
