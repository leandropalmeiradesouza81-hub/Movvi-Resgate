import express from 'express';
import { Lead } from '../models.js';

const router = express.Router();

// Submit a new lead
router.post('/', async (req, res) => {
    try {
        const { type, name, company, email, phone, message } = req.body;

        if (!name || !email || !phone) {
            return res.status(400).json({ error: 'Campos obrigatórios: Nome, Email e Telefone.' });
        }

        const newLead = await Lead.create({
            type: type || 'contact',
            name,
            company,
            email,
            phone,
            message
        });

        console.log(`[LEAD] Novo lead recebido (${type}):`, name);
        res.status(201).json({ success: true, leadId: newLead._id });
    } catch (err) {
        console.error('[LEAD] Erro ao salvar lead:', err);
        res.status(500).json({ error: 'Erro interno ao salvar contato.' });
    }
});

// Admin: List all leads (Requires auth middleware ideally, but following existing patterns)
router.get('/', async (req, res) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 });
        res.json(leads);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar leads.' });
    }
});

export default router;
