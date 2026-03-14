import { Router } from 'express';
import { Setting, Driver } from '../models.js';

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
    if (req.body.b2bTiers) {
        pricing.value.b2bTiers = req.body.b2bTiers;
    }

    pricing.markModified('value');
    await pricing.save();
    
    if (req.io) {
        req.io.to('admin').emit('pricing:updated', pricing.value);

        // Broadcast spots update to all (for invitation page real-time sync)
        const settingsObj = await Setting.findOne({ key: 'settings' });
        const settings = settingsObj?.value || {};
        const approvedCount = await Driver.countDocuments({ approved: true });
        req.io.emit('spots:updated', {
            totalSpots: settings.totalSpotsPhase1 || 200,
            occupiedSpots: approvedCount
        });
    }
    res.json(pricing.value);
});

router.put('/settings', async (req, res) => {
    let settings = await Setting.findOne({ key: 'settings' });
    if (!settings) settings = new Setting({ key: 'settings', value: {} });

    Object.assign(settings.value, req.body);
    settings.markModified('value');
    await settings.save();
    
    if (req.io) {
        // Count approved drivers for spots update
        const approvedCount = await Driver.countDocuments({ approved: true });
        req.io.emit('spots:updated', {
            totalSpots: settings.value.totalSpotsPhase1 || 200,
            occupiedSpots: approvedCount
        });
    }
    
    res.json(settings.value);
});

router.get('/settings', async (req, res) => {
    const settings = await Setting.findOne({ key: 'settings' });
    res.json(settings?.value || {});
});

router.get('/public', async (req, res) => {
    const settingsObj = await Setting.findOne({ key: 'settings' });
    const settings = settingsObj?.value || {};
    
    // Count approved drivers for phase 1
    const approvedCount = await Driver.countDocuments({ approved: true });
    
    res.json({
        launchDate: settings.launchDate || "2026-04-20",
        totalSpots: settings.totalSpotsPhase1 || 200,
        occupiedSpots: approvedCount,
        systemLockdown: settings.systemLockdown || false
    });
});

export default router;
