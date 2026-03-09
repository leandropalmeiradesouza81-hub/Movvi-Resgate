import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.json(req.db.data.pricing);
});

router.put('/', async (req, res) => {
    const { basePrice, pricePerKm, services } = req.body;
    if (basePrice !== undefined) req.db.data.pricing.basePrice = basePrice;
    if (pricePerKm !== undefined) req.db.data.pricing.pricePerKm = pricePerKm;
    if (services) {
        for (const [key, val] of Object.entries(services)) {
            if (req.db.data.pricing.services[key]) {
                Object.assign(req.db.data.pricing.services[key], val);
            }
        }
    }
    await req.db.write();
    req.io.to('admin').emit('pricing:updated', req.db.data.pricing);
    res.json(req.db.data.pricing);
});

router.put('/settings', async (req, res) => {
    Object.assign(req.db.data.settings, req.body);
    await req.db.write();
    res.json(req.db.data.settings);
});

router.get('/settings', (req, res) => {
    res.json(req.db.data.settings);
});

export default router;
