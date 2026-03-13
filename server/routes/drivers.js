import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { createPixCharge } from '../services/pix.js';
import { Driver, WalletTransaction, Setting } from '../models.js';

const router = Router();

router.get('/', async (req, res) => {
    const drivers = await Driver.find({}, '-password');
    res.json(drivers);
});

router.get('/online', async (req, res) => {
    const drivers = await Driver.find({ online: true }, '-password');
    res.json(drivers);
});

router.get('/referral/:code', async (req, res) => {
    const driver = await Driver.findOne({ referralCode: req.params.code });
    if (!driver) return res.status(404).json({ error: 'Convite inválido' });

    const now = new Date();
    if (driver.referralExpiresAt && now > driver.referralExpiresAt) {
        return res.status(410).json({ error: 'Este link de convite expirou' });
    }

    res.json({
        name: driver.name,
        photo: driver.photo,
        expiresAt: driver.referralExpiresAt
    });
});

router.get('/test', (req, res) => res.json({ status: 'drivers router ok' }));

router.get('/:id/wallet', async (req, res) => {
    const driver = await Driver.findOne({ id: req.params.id });
    if (!driver) return res.status(404).json({ error: 'Motorista não encontrado' });

    const txs = await WalletTransaction.find({ driverId: req.params.id })
        .sort({ createdAt: -1 });

    res.json({ balance: driver.walletBalance || 0, transactions: txs });
});

router.get('/:id', async (req, res) => {
    const driver = await Driver.findOne({ id: req.params.id }, '-password');
    if (!driver) return res.status(404).json({ error: 'Motorista não encontrado' });
    res.json(driver);
});

router.put('/:id', async (req, res) => {
    const driver = await Driver.findOne({ id: req.params.id });
    if (!driver) return res.status(404).json({ error: 'Motorista não encontrado' });
    
    const fields = ['name', 'phone', 'vehicle', 'plate', 'photo', 'pixKey', 'kitAcquired', 'approved', 'onboardingStep', 'cnhStatus', 'crlvStatus'];
    fields.forEach(field => {
        if (req.body[field] !== undefined) driver[field] = req.body[field];
    });

    await driver.save();
    const driverDoc = driver.toObject();
    delete driverDoc.password;
    res.json(driverDoc);
});

router.post('/:id/pay', async (req, res) => {
    const driver = await Driver.findOne({ id: req.params.id });
    if (!driver) return res.status(404).json({ error: 'Motorista não encontrado' });

    let amount = parseFloat(req.body.amount);
    if (isNaN(amount) || amount <= 0) {
        amount = Math.abs(driver.walletBalance || 0);
        if (amount <= 0) return res.status(400).json({ error: 'Nenhum valor informado para recarga.' });
    }

    const currentBal = driver.walletBalance || 0;
    driver.walletBalance = Math.round((currentBal + amount) * 100) / 100;

    if (driver.walletBalance > -50) {
        driver.blocked = false;
        driver.blockingReason = '';
    }

    await WalletTransaction.create({
        id: uuid(),
        driverId: driver.id,
        type: 'payment',
        description: 'Recarga de Saldo (PIX)',
        amount: amount,
        balanceAfter: driver.walletBalance
    });

    await driver.save();
    res.json({ success: true, balance: driver.walletBalance });
});

router.post('/:id/pix/generate', async (req, res) => {
    const driver = await Driver.findOne({ id: req.params.id });
    if (!driver) return res.status(404).json({ error: 'Motorista não encontrado' });

    const { amount, reason } = req.body;
    const txid = uuid().replace(/-/g, '').substring(0, 35);
    
    const settings = await Setting.findOne({ key: 'settings' });
    const pixKey = settings?.value?.platformPixKey || "65628833000147";

    try {
        const charge = await createPixCharge({
            amount: parseFloat(amount),
            description: reason === 'kit' ? 'Pagamento Kit Movvi Resgate' : 'Recarga de Saldo Movvi',
            txid: txid,
            pixKey: pixKey
        });

        driver.pendingTxid = txid;
        await driver.save();

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
    const result = await Driver.deleteOne({ id: req.params.id });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Motorista não encontrado' });
    res.json({ success: true });
});

export default router;
