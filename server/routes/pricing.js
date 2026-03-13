import { Router } from 'express';
import { Setting } from '../models.js';

const router = Router();

router.get('/', async (req, res) => {
    const pricing = await Setting.findOne({ key: 'pricing' });
    res.json(pricing?.value || {});
});

router.put('/', async (req, res) => {
    const { basePrice, pricePerKm, services } = req.body;
    let pricing = await Setting.findOne({ key: 'pricing' });
    if (!pricing) pricing = new Setting({ key: 'pricing', value: {} });

    if (basePrice !== undefined) pricing.value.basePrice = basePrice;
    if (pricePerKm !== undefined) pricing.value.pricePerKm = pricePerKm;
    if (services) {
        for (const [key, val] of Object.entries(services)) {
            if (pricing.value.services[key]) {
                Object.assign(pricing.value.services[key], val);
            }
        }
    }

    pricing.markModified('value');
    await pricing.save();
    
    if (req.io) {
        req.io.to('admin').emit('pricing:updated', pricing.value);
    }
    res.json(pricing.value);
});

router.put('/settings', async (req, res) => {
    let settings = await Setting.findOne({ key: 'settings' });
    if (!settings) settings = new Setting({ key: 'settings', value: {} });

    Object.assign(settings.value, req.body);
    settings.markModified('value');
    await settings.save();
    res.json(settings.value);
});

router.get('/settings', async (req, res) => {
    const settings = await Setting.findOne({ key: 'settings' });
    res.json(settings?.value || {});
});

export default router;
