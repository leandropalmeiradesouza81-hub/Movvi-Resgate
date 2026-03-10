import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { Resend } from 'resend';

const router = Router();
const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_key'); // Set in Render ENV

// Common Email Template Builder
const buildEmailTemplate = (name, resetUrl) => `
<div style="background-color: #0a0a0a; color: #ffffff; padding: 50px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center; border-radius: 0;">
  <div style="max-width: 500px; margin: 0 auto; background-color: #1a170e; padding: 40px; border: 1px solid #363117; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
    <img src="https://movvi-resgate.onrender.com/assets/images/logo_movvi.png" width="200" alt="Movvi Resgate" style="margin-bottom: 30px;">
    
    <h1 style="color: #ffd900; font-size: 24px; font-weight: 800; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px;">Recuperação de Senha</h1>
    <p style="color: #a1a1aa; font-size: 15px; margin-bottom: 30px;">Olá, <b>${name}</b>! Recebemos uma solicitação para redefinir o acesso à sua conta Movvi.</p>
    
    <div style="margin: 40px 0;">
      <a href="${resetUrl}" style="background-color: #ffd900; color: #1a1400; font-weight: 900; padding: 18px 35px; text-decoration: none; border-radius: 16px; font-size: 16px; display: inline-block; transition: transform 0.2s; box-shadow: 0 4px 15px rgba(255,217,0,0.3); text-transform: uppercase; letter-spacing: 0.5px;">Redefinir Senha</a>
    </div>
    
    <p style="color: #71717a; font-size: 12px; line-height: 1.6;">Este link expira em 1 hora. Se você não solicitou a redefinição, apenas ignore este email.</p>
    
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #2d2812;">
      <p style="font-size: 10px; color: #4b441d; letter-spacing: 2px; font-weight: bold; text-transform: uppercase;">Movvi Resgate &bull; Parceiro de Confiança</p>
    </div>
  </div>
</div>
`;

async function handleForgotPassword(req, res, collection) {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email é obrigatório' });

    const user = req.db.data[collection].find(u => u.email.toLowerCase() === email.toLowerCase());
    
    // Always return success for security (prevent email enumeration)
    if (!user) {
        return res.json({ message: 'Se o email existir, um link de recuperação será enviado.' });
    }

    const token = uuid();
    user.resetToken = token;
    user.resetExpires = Date.now() + 3600000; // 1 hour
    await req.db.write();

    const baseUrl = process.env.RENDER_EXTERNAL_URL || 'https://movvi-resgate.onrender.com';
    const type = collection === 'clients' ? 'client' : 'driver';
    const resetUrl = `${baseUrl}/reset-password.html?token=${token}&type=${type}`;

    try {
        await resend.emails.send({
            from: 'Movvi Resgate <noreply@movvi.com>',
            to: [email],
            subject: 'Redefinição de Senha - Movvi Resgate',
            html: buildEmailTemplate(user.name?.split(' ')[0] || 'Parceiro', resetUrl)
        });
        console.log(`[AUTH] Reset email sent to ${email} (${type})`);
        res.json({ message: 'Se o email existir, um link de recuperação será enviado.' });
    } catch (error) {
        console.error('[AUTH] Email error:', error);
        res.status(500).json({ error: 'Erro ao enviar email. Tente novamente mais tarde.' });
    }
}

router.post('/forgot-password/client', async (req, res) => {
    await handleForgotPassword(req, res, 'clients');
});

router.post('/forgot-password/driver', async (req, res) => {
    await handleForgotPassword(req, res, 'drivers');
});

router.post('/reset-password', async (req, res) => {
    const { token, type, password } = req.body;
    if (!token || !type || !password) return res.status(400).json({ error: 'Dados incompletos' });

    const collection = type === 'client' ? 'clients' : 'drivers';
    const user = req.db.data[collection].find(u => u.resetToken === token && u.resetExpires > Date.now());

    if (!user) {
        return res.status(401).json({ error: 'Link de recuperação inválido ou expirado' });
    }

    user.password = password;
    user.resetToken = null;
    user.resetExpires = null;
    await req.db.write();

    res.json({ message: 'Senha redefinida com sucesso!' });
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
    console.log(`[AUTH] Admin login attempt: ${email}`);
    
    const admin = req.db.data.admins.find(a => a.email.toLowerCase() === email && a.password === password);
    
    if (admin) {
        console.log('[AUTH] Admin login success');
        const { password: _, ...safe } = admin;
        res.json({ user: safe, token: 'admin_token' });
    } else {
        console.log('[AUTH] Admin login failed: Invalid credentials');
        res.status(401).json({ error: 'Credenciais inválidas' });
    }
});

export default router;
