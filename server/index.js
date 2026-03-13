import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { initDB } from './db.js';
import { setupSocketHandlers } from './socket/handler.js';
import { resumeAllMatching } from './services/matching.js';
import authRoutes from './routes/auth.js';
import orderRoutes from './routes/orders.js';
import driverRoutes from './routes/drivers.js';
import pricingRoutes from './routes/pricing.js';
import adminRoutes from './routes/admin.js';
import newsRoutes from './routes/news.js';
import webhookRoutes from './routes/webhooks.js';
import seoRoutes, { generateSitemapXML } from './routes/seo.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] }
});

app.use(cors());
app.use(express.json());

const dbProxy = await initDB();

app.use((req, res, next) => {
    req.db = dbProxy;
    req.io = io;
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/local', seoRoutes);

// SEO Root Routes
app.get('/sitemap.xml', (req, res) => {
    res.header('Content-Type', 'application/xml');
    res.send(generateSitemapXML());
});
app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send('User-agent: *\nAllow: /\nAllow: /local/\n\nSitemap: https://movviresgate.com.br/sitemap.xml');
});

app.get('/google2a4285b186031aeb.html', (req, res) => {
    res.send('google-site-verification: google2a4285b186031aeb.html');
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

setupSocketHandlers(io);
resumeAllMatching(io);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    // Handle SPA routing - serve index.html for any unknown routes
    app.get('*', (req, res) => {
        if (!req.path.startsWith('/api')) {
            res.sendFile('index.html', { root: 'dist' });
        }
    });
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`[MOVVI] Server running on http://localhost:${PORT}`);
    console.log(`[MOVVI] Frontend: http://localhost:5173`);
});
