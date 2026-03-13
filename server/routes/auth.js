import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { Resend } from 'resend';
import { Client, Driver, Admin } from '../models.js';

const router = Router();
const resend = new Resend('re_aEabgbLG_BFgMQHvJnp5DYjKEbcPawAtS');

const buildEmailTemplate = (name, title, content, buttonText = null, buttonUrl = null) => `
<div style="background-color: #0a0a0a; color: #ffffff; padding: 50px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center; border-radius: 0;">
  <div style="max-width: 500px; margin: 0 auto; background-color: #1a170e; padding: 40px; border: 1px solid #363117; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
    <img src="https://movviresgate.com/assets/images/logo_movvi.png" width="200" alt="Movvi Resgate" style="margin-bottom: 30px;">
    <h1 style="color: #ffd900; font-size: 24px; font-weight: 800; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px;">${title}</h1>
    <p style="color: #ffffff; font-size: 16px; font-weight: 600; margin-bottom: 10px;">Olá, ${name}!</p>
    <div style="color: #a1a1aa; font-size: 14px; line-height: 1.6; margin-bottom: 30px;">${content}</div>
    ${buttonText && buttonUrl ? `
    <div style="margin: 40px 0;">
      <a href="${buttonUrl}" style="background-color: #ffd900; color: #1a1400; font-weight: 900; padding: 18px 35px; text-decoration: none; border-radius: 16px; font-size: 15px; display: inline-block; transition: transform 0.2s; box-shadow: 0 4px 15px rgba(255,217,0,0.3); text-transform: uppercase; letter-spacing: 0.5px;">${buttonText}</a>
    </div>` : ''}
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #2d2812;">
      <p style="font-size: 10px; color: #4b441d; letter-spacing: 2px; font-weight: bold; text-transform: uppercase;">Movvi Resgate &bull; Parceiro de Confiança</p>
    </div>
  </div>
</div>
`;

async function handleForgotPassword(req, res, collection) {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email é obrigatório' });

    const Model = collection === 'clients' ? Client : Driver;
    const user = await Model.findOne({ email: new RegExp(`^${email}$`, 'i') });
    
    if (!user) {
        return res.json({ message: 'Se o email existir, um link de recuperação será enviado.' });
    }

    const token = uuid();
    user.resetToken = token;
    user.resetExpires = Date.now() + 3600000;
    await user.save();

    const baseUrl = 'https://movviresgate.com';
    const type = collection === 'clients' ? 'client' : 'driver';
    const resetUrl = `${baseUrl}/reset-password.html?token=${token}&type=${type}`;

    try {
        await resend.emails.send({
            from: 'Movvi Resgate <noreply@movviresgate.com>',
            to: [email],
            subject: 'Redefinição de Senha - Movvi Resgate',
            html: buildEmailTemplate(
                user.name?.split(' ')[0] || 'Parceiro',
                'Recuperação de Senha',
                'Recebemos uma solicitação para redefinir o acesso à sua conta Movvi. Se não foi você, apenas ignore este email.',
                'Redefinir Senha',
                resetUrl
            )
        });
        res.json({ message: 'Se o email existir, um link de recuperação será enviado.' });
    } catch (error) {
        console.error('[AUTH] Reset Email error:', error);
        res.status(500).json({ error: 'Erro ao enviar email.' });
    }
}

router.post('/forgot-password/client', (req, res) => handleForgotPassword(req, res, 'clients'));
router.post('/forgot-password/driver', (req, res) => handleForgotPassword(req, res, 'drivers'));

router.post('/reset-password', async (req, res) => {
    const { token, type, password } = req.body;
    if (!token || !type || !password) return res.status(400).json({ error: 'Dados incompletos' });

    const Model = type === 'client' ? Client : Driver;
    const user = await Model.findOne({ resetToken: token, resetExpires: { $gt: Date.now() } });

    if (!user) {
        return res.status(401).json({ error: 'Link de recuperação inválido ou expirado' });
    }

    user.password = password;
    user.resetToken = null;
    user.resetExpires = null;
    await user.save();

    res.json({ message: 'Senha redefinida com sucesso!' });
});

router.post('/register/client', async (req, res) => {
    const { name, email, phone, cpf, password, vehicleModel } = req.body;
    if (!name || !email || !phone) {
        return res.status(400).json({ error: 'Nome, email e telefone são obrigatórios' });
    }
    const existing = await Client.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email já cadastrado' });

    const client = await Client.create({
        id: uuid(),
        name, email, phone, cpf: cpf || '',
        vehicleModel: vehicleModel || '',
        password: password || '123456',
        rating: 5.0,
        totalOrders: 0
    });

    try {
        await resend.emails.send({
            from: 'Movvi Resgate <welcome@movviresgate.com>',
            to: [email],
            subject: 'Bem-vindo à Movvi Resgate!',
            html: buildEmailTemplate(
                name.split(' ')[0], 
                'Seja Bem-vindo!', 
                'Sua conta foi criada com sucesso. Agora você tem acesso à rede de assistência veicular mais rápida do Brasil.',
                'Acessar Minha Conta',
                'https://movviresgate.com/client.html'
            )
        });
    } catch (e) {
        console.error('[AUTH] Welcome email error:', e);
    }

    const clientObj = client.toObject();
    delete clientObj.password;
    res.status(201).json(clientObj);
});

router.post('/register/driver', async (req, res) => {
    const { name, email, phone, cpf, cnh, vehicle, plate, password, pixKey } = req.body;
    if (!name || !email || !phone) {
        return res.status(400).json({ error: 'Nome, email e telefone são obrigatórios' });
    }
    const existing = await Driver.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email já cadastrado' });

    const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const driver = await Driver.create({
        id: uuid(),
        name, email, phone,
        cpf: cpf || '', cnh: cnh || '',
        vehicle: vehicle || '', plate: plate || '',
        password: password || '123456',
        pixKey: pixKey || cpf || phone || '',
        referralCode,
        referredBy: req.body.referredBy || null,
        onboardingStep: 'documents', // Start at documents after pre-registration info
        approved: false
    });

    try {
        await resend.emails.send({
            from: 'Movvi Resgate <welcome@movviresgate.com>',
            to: [email],
            subject: 'Seja um Motorista Parceiro Movvi!',
            html: buildEmailTemplate(
                name.split(' ')[0], 
                'Bem-vindo, Parceiro!', 
                'Seu cadastro foi recebido! O próximo passo é enviar seus documentos no aplicativo para começar a ganhar dinheiro com resgates.',
                'Completar Cadastro',
                'https://movviresgate.com/driver.html'
            )
        });
    } catch (e) {
        console.error('[AUTH] Welcome email error:', e);
    }

    const driverObj = driver.toObject();
    delete driverObj.password;
    res.status(201).json({ user: driverObj, token: `driver_${driver.id}` });
});

router.post('/login/client', async (req, res) => {
    const { email, password } = req.body;
    const client = await Client.findOne({ email });
    if (!client) return res.status(401).json({ error: 'Email não encontrado' });
    if (client.password !== password) return res.status(401).json({ error: 'Senha incorreta' });
    
    const clientObj = client.toObject();
    delete clientObj.password;
    res.json({ user: clientObj, token: `client_${client.id}` });
});

router.post('/login/driver', async (req, res) => {
    const { email, password } = req.body;
    const driver = await Driver.findOne({ email });
    if (!driver) return res.status(401).json({ error: 'Email não encontrado' });
    if (driver.password !== password) return res.status(401).json({ error: 'Senha incorreta' });
    
    const driverObj = driver.toObject();
    delete driverObj.password;
    res.json({ user: driverObj, token: `driver_${driver.id}` });
});

router.post('/login/admin', async (req, res) => {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password?.trim();
    
    const admin = await Admin.findOne({ email, password });
    
    if (admin) {
        const adminObj = admin.toObject();
        delete adminObj.password;
        res.json({ user: adminObj, token: 'admin_token' });
    } else {
        res.status(401).json({ error: 'Credenciais inválidas' });
    }
});

export default router;
