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
        id: uuid(),
        clientId: partner.id,
        serviceType,
        status: 'searching',
        origin,
        pickupLat: origin.lat || 0, // In production, we should geocode or get from UI
        pickupLon: origin.lng || 0,
        pickupAddress: origin.address,
        destination,
        destinationLat: destination.lat || 0,
        destinationLon: destination.lng || 0,
        destinationAddress: destination.address,
        distance,
        duration,
        price,
        driverPrice: price, // Direct payment to driver
        paymentMethod: 'pix_direct',
        txid,
        paid: false,
        metadata: {
            isB2B: true,
            customerName,
            customerPlate
        },
        clientName: partner.companyName,
        clientPhone: partner.phone
    });

    // Inicia o matching para encontrar motoristas
    const { startMatching } = await import('../services/matching.js');
    startMatching(req.io, {}, order.id);

    res.status(201).json({
        success: true,
        orderId: order.id,
        status: 'searching'
    });
});

export default router;
