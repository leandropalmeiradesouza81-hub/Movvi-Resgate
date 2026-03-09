import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, 'db.json');

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
    }
};

export async function initDB() {
    const adapter = new JSONFile(DB_PATH);
    const db = new Low(adapter, defaultData);
    await db.read();

    // Robust initialization
    if (!db.data) db.data = { ...defaultData };
    else {
        for (const key in defaultData) {
            if (db.data[key] === undefined) {
                db.data[key] = defaultData[key];
            }
        }
    }

    await db.write();
    console.log('[DB] LowDB initialized at', DB_PATH);
    return db;
}
