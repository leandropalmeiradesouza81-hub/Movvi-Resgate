import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { Partner, Order, Driver, WalletTransaction } from '../models.js';
import { createPixCharge } from '../services/pix.js';

const router = Router();

// List all partners (admin only)
router.get('/', async (req, res) => {
    const partners = await Partner.find({}, '-password');
    res.json(partners);
});

// Get profile
router.get('/:id', async (req, res) => {
    const partner = await Partner.findOne({ id: req.params.id }, '-password');
    if (!partner) return res.status(404).json({ error: 'Parceiro não encontrado' });
    res.json(partner);
});

// Update profile
router.put('/:id', async (req, res) => {
    const partner = await Partner.findOne({ id: req.params.id });
    if (!partner) return res.status(404).json({ error: 'Parceiro não encontrado' });
    
    const fields = ['name', 'companyName', 'phone', 'cnpj', 'active'];
    fields.forEach(field => {
        if (req.body[field] !== undefined) partner[field] = req.body[field];
    });

    await partner.save();
    const pObj = partner.toObject();
    delete pObj.password;
    res.json(pObj);
});

// Create Order (B2B Request)
router.post('/:id/order', async (req, res) => {
    const partner = await Partner.findOne({ id: req.params.id });
    if (!partner) return res.status(404).json({ error: 'Parceiro não encontrado' });

    const { 
        serviceType, 
        origin, 
        destination, 
        distance, 
        duration, 
        customerName, 
        customerPlate 
    } = req.body;

    // Fixed Pricing Logic for B2B
    // <= 30km -> 110
    // 31-40km -> 145
    // 41-55km -> 170
    let price = 110;
    if (distance > 30 && distance <= 40) price = 145;
    else if (distance > 40) price = 170; // Assuming 170 for anything above 40 for now, or capping at 55 as per user request

    const orderId = uuid();
    const txid = uuid().replace(/-/g, '').substring(0, 35);

    const order = await Order.create({
        id: orderId,
        clientId: partner.id, // We use clientId to store who requested (Partner ID)
        serviceType,
        status: 'pending',
        origin,
        destination,
        distance,
        duration,
        price,
        paymentMethod: 'pix',
        txid,
        paid: false,
        metadata: {
            isB2B: true,
            customerName,
            customerPlate
        }
    });

    // Generate PIX
    try {
        const pix = await createPixCharge({
            amount: price,
            description: `Resgate Movvi B2B - ${customerPlate}`,
            txid,
            pixKey: "65628833000147" // Platform PIX Key
        });

        order.pixCode = pix.pixCopiaECola;
        await order.save();

        res.json({
            success: true,
            orderId,
            price,
            pixCode: pix.pixCopiaECola
        });
    } catch (e) {
        res.status(500).json({ error: 'Erro ao gerar cobrança PIX.' });
    }
});

export default router;
