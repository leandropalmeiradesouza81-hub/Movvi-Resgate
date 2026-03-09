import { Router } from 'express';
import { v4 as uuid } from 'uuid';

const router = Router();

router.post('/forgot-password/client', async (req, res) => {
    const { email } = req.body;
    res.json({ message: 'Se o email existir, um link de recuperação será enviado.' });
});

router.post('/forgot-password/driver', async (req, res) => {
    const { email } = req.body;
    res.json({ message: 'Se o email existir, um link de recuperação será enviado.' });
});

router.post('/register/client', async (req, res) => {
    const { name, email, phone, cpf, password, vehicleModel } = req.body;
    if (!name || !email || !phone) {
        return res.status(400).json({ error: 'Nome, email e telefone são obrigatórios' });
    }
    const existing = req.db.data.clients.find(c => c.email === email);
    if (existing) return res.status(409).json({ error: 'Email já cadastrado' });

    const client = {
        id: uuid(),
        name, email, phone, cpf: cpf || '',
        vehicleModel: vehicleModel || '',
        password: password || '123456',
        createdAt: new Date().toISOString(),
        rating: 5.0,
        totalOrders: 0
    };
    req.db.data.clients.push(client);
    await req.db.write();
    const { password: _, ...safe } = client;
    res.status(201).json(safe);
});

router.post('/register/driver', async (req, res) => {
    const { name, email, phone, cpf, cnh, vehicle, plate, password, pixKey } = req.body;
    if (!name || !email || !phone) {
        return res.status(400).json({ error: 'Nome, email e telefone são obrigatórios' });
    }
    const existing = req.db.data.drivers.find(d => d.email === email);
    if (existing) return res.status(409).json({ error: 'Email já cadastrado' });

    const driver = {
        id: uuid(),
        name, email, phone,
        cpf: cpf || '', cnh: cnh || '',
        vehicle: vehicle || '', plate: plate || '',
        password: password || '123456',
        photo: '',
        online: false,
        blocked: false,
        blockingReason: '',
        walletBalance: 0,
        latitude: 0, longitude: 0,
        activeOrderId: null,
        rating: 5.0,
        totalOrders: 0,
        totalEarnings: 0,
        kitAcquired: false,
        onboardingStep: 'documents', // documents, kit, pending_approval, approved
        cnhStatus: 'pending',
        crlvStatus: 'pending',
        approved: false,
        pixKey: pixKey || cpf || phone || '',
        createdAt: new Date().toISOString()
    };
    req.db.data.drivers.push(driver);
    await req.db.write();
    const { password: _, ...safe } = driver;
    res.status(201).json({ user: safe, token: `driver_${driver.id}` });
});

router.post('/login/client', async (req, res) => {
    const { email, password } = req.body;
    const client = req.db.data.clients.find(c => c.email === email);
    if (!client) return res.status(401).json({ error: 'Email não encontrado' });
    if (client.password !== password) return res.status(401).json({ error: 'Senha incorreta' });
    const { password: _, ...safe } = client;
    res.json({ user: safe, token: `client_${client.id}` });
});

router.post('/login/driver', async (req, res) => {
    const { email, password } = req.body;
    const driver = req.db.data.drivers.find(d => d.email === email);
    if (!driver) return res.status(401).json({ error: 'Email não encontrado' });
    if (driver.password !== password) return res.status(401).json({ error: 'Senha incorreta' });
    const { password: _, ...safe } = driver;
    res.json({ user: safe, token: `driver_${driver.id}` });
});

router.post('/login/admin', async (req, res) => {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password?.trim();
    console.log(`[AUTH] Admin login attempt: ${email} / ${password}`);
    if (email === 'admin@movvi.com' && password === 'admin123') {
        console.log('[AUTH] Admin login success');
        res.json({ user: { id: 'admin', name: 'Administrador', role: 'admin' }, token: 'admin_token' });
    } else {
        console.log('[AUTH] Admin login failed: Invalid credentials');
        res.status(401).json({ error: 'Credenciais inválidas' });
    }
});

export default router;
