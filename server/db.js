import mongoose from 'mongoose';
import { Setting, Admin } from './models.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://leandropalmeiradesouza81_db_user:x5avGzneUGSidHeR@cluster0.madtagb.mongodb.net/movvi?retryWrites=true&w=majority';

const defaultPricing = {
    basePrice: 50,
    pricePerKm: 5,
    services: {
        reboque: { name: 'Reboque no Cambão', basePrice: 80, pricePerKm: 6 },
        pane_seca: { name: 'Pane Seca', basePrice: 20, pricePerKm: 1.5 },
        chupeta: { name: 'Chupeta', basePrice: 35, pricePerKm: 3 },
        pneu: { name: 'Troca de Pneu', basePrice: 45, pricePerKm: 3.5 }
    }
};

const defaultSettings = {
    matchTimeout: 15000,
    maxSearchRadius: -1,
    platformFee: 15,
    systemLockdown: true,
    launchDate: "2026-04-20",
    totalSpotsPhase1: 100,
    platformPixKey: "65628833000147"
};

export async function initDB() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('[DB] Connected to MongoDB Atlas');

        // Initialize Defaults if missing
        const pricingExists = await Setting.findOne({ key: 'pricing' });
        if (!pricingExists) {
            await Setting.create({ key: 'pricing', value: defaultPricing });
            console.log('[DB] Default pricing initialized');
        }

        const settingsExists = await Setting.findOne({ key: 'settings' });
        if (!settingsExists) {
            await Setting.create({ key: 'settings', value: defaultSettings });
            console.log('[DB] Default settings initialized');
        }

        const adminExists = await Admin.findOne({ email: 'leandro2703palmeira@gmail.com' });
        if (!adminExists) {
            await Admin.create({
                email: 'leandro2703palmeira@gmail.com',
                password: 'Lps27031981@',
                name: 'Administrador',
                role: 'admin'
            });
            console.log('[DB] Default admin created');
        }

        // Return a mock object to maintain compatibility with req.db.data
        // although we should gradually move to direct model usage
        return {
            read: () => Promise.resolve(),
            write: () => Promise.resolve(),
            data: null // Handled via models now
        };
    } catch (err) {
        console.error('[DB] MongoDB Connection Error:', err);
        process.exit(1);
    }
}
