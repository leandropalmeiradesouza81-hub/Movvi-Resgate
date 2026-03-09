import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '../server/db.json');

const defaultData = {
    clients: [],
    drivers: [],
    orders: [],
    walletTransactions: [],
    pricing: {
        basePrice: 50,
        pricePerKm: 5,
        services: {
            reboque: { name: 'Reboque no Cambão', basePrice: 80, pricePerKm: 6 },
            pane_seca: { name: 'Pane Seca', basePrice: 20, pricePerKm: 1.5 },
            chupeta: { name: 'Chupeta', basePrice: 35, pricePerKm: 3 },
            pneu: { name: 'Troca de Pneu', basePrice: 45, pricePerKm: 3.5 }
        }
    },
    settings: {
        matchTimeout: 15000,
        maxSearchRadius: -1,
        platformFee: 15
    },
    admins: [
        {
            email: "leadnro2703palmeira@gmail.com",
            password: "Lps27031981@",
            role: "admin",
            name: "Administrador"
        }
    ]
};

try {
    writeFileSync(DB_PATH, JSON.stringify(defaultData, null, 2));
    console.log('Database reset and admin seeded successfully.');
} catch (error) {
    console.error('Error resetting database:', error);
}
