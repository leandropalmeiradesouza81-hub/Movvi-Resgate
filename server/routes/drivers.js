import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { createPixCharge } from '../services/pix.js';

const router = Router();

router.get('/', (req, res) => {
    const drivers = req.db.data.drivers.map(({ password, ...d }) => d);
    res.json(drivers);
});

router.get('/online', (req, res) => {
    const drivers = req.db.data.drivers
        .filter(d => d.online)
        .map(({ password, ...d }) => d);
    res.json(drivers);
});

router.get('/test', (req, res) => res.json({ status: 'drivers router ok' }));

router.get('/:id/wallet', (req, res) => {
    const driver = req.db.data.drivers.find(d => d.id === req.params.id);
    if (!driver) return res.status(404).json({ error: 'Motorista não encontrado' });

    const txs = (req.db.data.walletTransactions || [])
        .filter(t => t.driverId === req.params.id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ balance: driver.walletBalance || 0, transactions: txs });
});

router.get('/:id', (req, res) => {
    const driver = req.db.data.drivers.find(d => d.id === req.params.id);
    if (!driver) return res.status(404).json({ error: 'Motorista não encontrado' });
    const { password, ...safe } = driver;
    res.json(safe);
});

router.put('/:id', async (req, res) => {
    const driver = req.db.data.drivers.find(d => d.id === req.params.id);
    if (!driver) return res.status(404).json({ error: 'Motorista não encontrado' });
    const { name, phone, vehicle, plate, photo, pixKey, kitAcquired, approved, onboardingStep, cnhStatus, crlvStatus } = req.body;
    if (name !== undefined) driver.name = name;
    if (phone !== undefined) driver.phone = phone;
    if (vehicle !== undefined) driver.vehicle = vehicle;
    if (plate !== undefined) driver.plate = plate;
    if (photo !== undefined) driver.photo = photo;
    if (pixKey !== undefined) driver.pixKey = pixKey;
    if (kitAcquired !== undefined) driver.kitAcquired = kitAcquired;
    if (approved !== undefined) driver.approved = approved;
    if (onboardingStep !== undefined) driver.onboardingStep = onboardingStep;
    if (cnhStatus !== undefined) driver.cnhStatus = cnhStatus;
    if (crlvStatus !== undefined) driver.crlvStatus = crlvStatus;
    await req.db.write();
    const { password: _, ...safe } = driver;
    res.json(safe);
});

router.post('/:id/pay', async (req, res) => {
    const driver = req.db.data.drivers.find(d => d.id === req.params.id);
    if (!driver) return res.status(404).json({ error: 'Motorista não encontrado' });

    let amount = parseFloat(req.body.amount);
    if (isNaN(amount) || amount <= 0) {
        // Fallback to exactly the debt amount if no specific amount sent, but if no debt, return error
        amount = Math.abs(driver.walletBalance || 0);
        if (amount <= 0) return res.status(400).json({ error: 'Nenhum valor informado para recarga.' });
    }

    const currentBal = driver.walletBalance || 0;
    driver.walletBalance = Math.round((currentBal + amount) * 100) / 100;

    // Se o saldo for maior que o limite de bloqueio (-50), desbloquear
    if (driver.walletBalance > -50) {
        driver.blocked = false;
        driver.blockingReason = '';
    }

    if (!req.db.data.walletTransactions) req.db.data.walletTransactions = [];
    req.db.data.walletTransactions.push({
        id: uuid(),
        driverId: driver.id,
        type: 'payment',
        description: 'Recarga de Saldo (PIX)',
        amount: amount,
        balanceAfter: driver.walletBalance,
        createdAt: new Date().toISOString()
    });

    await req.db.write();
    res.json({ success: true, balance: driver.walletBalance });
});

router.post('/:id/pix/generate', async (req, res) => {
    const driver = req.db.data.drivers.find(d => d.id === req.params.id);
    if (!driver) return res.status(404).json({ error: 'Motorista não encontrado' });

    const { amount, reason } = req.body; // reason: 'kit' ou 'wallet'
    const txid = uuid().replace(/-/g, '').substring(0, 35); // txid deve ter entre 26 e 35 caracteres alfanuméricos
    const pixKey = req.db.data.settings.platformPixKey;

    try {
        const charge = await createPixCharge({
            amount: parseFloat(amount),
            description: reason === 'kit' ? 'Pagamento Kit Movvi Resgate' : 'Recarga de Saldo Movvi',
            txid: txid,
            pixKey: pixKey
        });

        // Salvar o txid pendente para o webhook identificar
        driver.pendingTxid = txid;
        await req.db.write();

        res.json({
            success: true,
            pixCopiaECola: charge.pixCopiaECola,
            txid: txid
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao gerar PIX. Tente novamente em instantes.' });
    }
});

router.delete('/:id', async (req, res) => {
    const idx = req.db.data.drivers.findIndex(d => d.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Motorista não encontrado' });
    req.db.data.drivers.splice(idx, 1);
    await req.db.write();
    res.json({ success: true });
});

export default router;
