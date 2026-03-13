import { Router } from 'express';
import { getTrafficNews } from '../services/newsService.js';

const router = Router();

export const locations = {
    'nilopolis': { name: 'Nilópolis', slug: 'nilopolis', description: 'Atendimento ultrarrápido em Nilópolis. Guinchos em pontos estratégicos da Getúlio de Moura e arredores.' },
    'sao-joao-de-meriti': { name: 'São João de Meriti', slug: 'sao-joao-de-meriti', description: 'Socorro 24h em São João de Meriti. Reboque barato próximo à Rodovia Presidente Dutra e Vilar dos Teles.' },
    'nova-iguacu': { name: 'Nova Iguaçu', slug: 'nova-iguacu', description: 'Líder em reboque em Nova Iguaçu. Atendimento no Centro, Posse, Austin e Via Light.' },
    'rio-de-janeiro': { name: 'Rio de Janeiro', slug: 'rio-de-janeiro', description: 'A maior rede de reboque particular do Rio de Janeiro. Guincho 24h em toda a capital.' },
    'caxias': { name: 'Duque de Caxias', slug: 'caxias', description: 'Reboque econômico em Duque de Caxias. Atendimento 24h em Santa Cruz da Serra, Imbariê e Centro.' },
    'belford-roxo': { name: 'Belford Roxo', slug: 'belford-roxo', description: 'Guincho rápido em Belford Roxo. Socorro 24h em Areia Branca, Heliópolis e Centro.' },
    'campo-grande': { name: 'Campo Grande', slug: 'campo-grande', description: 'Reboque 24h em Campo Grande RJ. Atendimento rápido na Estrada do Mendanha, Rio da Prata e Centro.' },
    'jacarepagua': { name: 'Jacarepaguá', slug: 'jacarepagua', description: 'Socorro veicular em Jacarepaguá. Atendimento na Taquara, Freguesia, Anil e Curicica.' },
    'zona-norte': { name: 'Zona Norte', slug: 'zona-norte', description: 'Reboque 24h na Zona Norte do Rio. Atendimento no Méier, Tijuca, Madureira e Pavuna.' }
};

export function generateSitemapXML() {
    const baseUrl = 'https://movviresgate.com.br';
    const staticPages = ['', '/convite.html', '/client.html', '/driver.html'];
    const localPages = Object.keys(locations).map(slug => `/local/${slug}`);
    const today = new Date().toISOString().split('T')[0];
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    
    [...staticPages, ...localPages].forEach(page => {
        xml += `<url>
            <loc>${baseUrl}${page}</loc>
            <lastmod>${today}</lastmod>
            <changefreq>daily</changefreq>
            <priority>${page === '' ? '1.0' : '0.8'}</priority>
        </url>`;
    });
    
    xml += '</urlset>';
    return xml;
}

router.get('/sitemap.xml', (req, res) => {
    res.header('Content-Type', 'application/xml');
    res.send(generateSitemapXML());
});

router.get('/:slug', async (req, res) => {
    const loc = locations[req.params.slug];
    if (!loc) return res.status(404).send('Localidade não encontrada');

    const news = await getTrafficNews(loc.name);

    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Guia ${loc.name} | Reboque e Guincho 24h | Movvi Resgate</title>
    <meta name="description" content="Guia de Bairros ${loc.name}: Notícias em tempo real, trânsito e o reboque mais barato da região. Movvi Resgate te salva em ${loc.name}!" />
    <meta name="keywords" content="reboque ${loc.name}, guincho ${loc.name}, guia ${loc.name}, notícias ${loc.name}, trânsito ${loc.name}, movvi resgate" />
    <link rel="canonical" href="https://movviresgate.com.br/local/${loc.slug}" />
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <style>
        :root { --primary: #ffd900; --bg: #f4f4f2; --text: #1a1a1a; --card-bg: #ffffff; }
        body { font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); margin: 0; line-height: 1.6; }
        
        .top-bar { background: #000; color: #fff; padding: 40px 24px; text-align: center; border-bottom: 8px solid var(--primary); }
        .logo-main { height: 70px; margin-bottom: 10px; }
        .news-badge { font-family: 'Outfit', sans-serif; font-size: 28px; font-weight: 900; color: var(--primary); text-transform: uppercase; letter-spacing: 2px; }
        
        .container { max-width: 1100px; margin: 0 auto; padding: 40px 24px; }
        
        .guia-header { text-align: center; margin-bottom: 60px; }
        .guia-header h1 { font-family: 'Outfit'; font-size: clamp(32px, 7vw, 54px); margin: 0; line-height: 1.1; }
        .guia-header p { font-size: 18px; color: #555; max-width: 700px; margin: 15px auto; }
        
        .emergency-banner { background: var(--primary); color: #000; padding: 30px; border-radius: 24px; display: flex; align-items: center; justify-content: space-between; gap: 30px; margin-bottom: 60px; box-shadow: 0 20px 40px rgba(255, 217, 0, 0.2); }
        .eb-text h2 { margin: 0; font-family: 'Outfit'; font-size: 28px; }
        .eb-btn { background: #000; color: #fff; padding: 15px 35px; border-radius: 99px; font-weight: 800; text-decoration: none; text-transform: uppercase; font-size: 14px; white-space: nowrap; }
        
        .news-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 25px; }
        .news-card { background: var(--card-bg); border-radius: 20px; overflow: hidden; border: 1px solid #e0e0e0; transition: transform 0.3s, box-shadow 0.3s; }
        .news-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
        .news-content { padding: 25px; }
        .news-meta { font-size: 11px; font-weight: 800; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; display: block; }
        .news-title { font-family: 'Outfit'; font-size: 20px; font-weight: 800; line-height: 1.3; margin-bottom: 15px; color: #000; }
        .news-footer { border-top: 1px solid #f0f0f0; padding: 15px 25px; background: #fafafa; display: flex; justify-content: space-between; align-items: center; }
        .news-link { color: #000; font-weight: 700; font-size: 13px; text-decoration: none; }
        
        .neighborhood-info { background: #fff; padding: 50px; border-radius: 30px; margin: 80px 0; border: 1px solid #eee; }
        .neighborhood-info h2 { font-family: 'Outfit'; font-size: 32px; margin-top: 0; }
        
        .footer { background: #000; color: #fff; padding: 80px 24px; text-align: center; }
        .city-links { margin-top: 30px; display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }
        .city-tag { color: #888; text-decoration: none; font-size: 12px; border: 1px solid #333; padding: 4px 12px; border-radius: 99px; }
        .city-tag:hover { color: var(--primary); border-color: var(--primary); }

        @media (max-width: 768px) {
            .emergency-banner { flex-direction: column; text-align: center; }
            .eb-btn { width: 100%; }
        }
    </style>
</head>
<body>
    <div class="top-bar">
        <img src="/assets/images/logo_movvi.png" alt="Movvi Resgate" class="logo-main">
        <div class="news-badge">${loc.name} News</div>
    </div>

    <main class="container">
        <div class="guia-header">
            <h1>Guia de Bairros: ${loc.name}</h1>
            <p>O portal completo para quem vive e circula por ${loc.name}. Notícias de trânsito em tempo real e assistência 24h.</p>
        </div>

        <div class="emergency-banner">
            <div class="eb-text">
                <h2>Precisa de Guincho agora em ${loc.name}?</h2>
                <p>Taxa fixa inicial de R$ 80. O socorro mais barato e rápido do Rio.</p>
            </div>
            <a href="https://movviresgate.com.br" class="eb-btn">Pedir Resgate Agora</a>
        </div>

        <div class="news-header-v2" style="margin-bottom: 30px;">
            <h2 style="font-family: 'Outfit'; font-size: 28px; border-bottom: 4px solid var(--primary); display: inline-block;">Acontece em ${loc.name}</h2>
        </div>

        <div class="news-grid">
            ${news.length ? news.map(n => `
                <div class="news-card">
                    <div class="news-content">
                        <span class="news-meta">${n.source} • ${n.timeAgo}</span>
                        <h3 class="news-title">${n.title}</h3>
                        <p style="font-size: 14px; color: #666;">Fique atento ao trânsito em ${loc.name}. A Movvi Resgate recomenda dirigir com cautela.</p>
                    </div>
                    <div class="news-footer">
                        <a href="${n.link}" target="_blank" class="news-link">LER NO G1 / R7</a>
                        <span style="font-size: 10px; color: #bbb;">REF: ${loc.slug.toUpperCase()}</span>
                    </div>
                </div>
            `).join('') : '<p>Carregando as notícias de hoje...</p>'}
        </div>

        <div class="neighborhood-info">
            <h2>Assistência 24h em ${loc.name}</h2>
            <p>Se você mora ou trabalha em ${loc.name}, sabe que o trânsito pode ser desafiador. A <strong>Movvi Resgate</strong> mantém motoristas parceiros em pontos estratégicos de toda a região para garantir que, em caso de pane seca, pneu furado ou bateria descarregada, você seja atendido em até 15 minutos.</p>
            <p>Nosso modelo de reboque no cambão é perfeito para as ruas de ${loc.name}, sendo muito mais ágil que os guinchos convencionais e custando metade do preço.</p>
        </div>
    </main>

    <footer class="footer">
        <img src="/assets/images/logo_movvi.png" alt="Movvi Resgate" style="height: 40px; margin-bottom: 20px; filter: grayscale(1) brightness(2);">
        <p>&copy; 2026 Movvi Logística e Frota. O portal do motorista do Rio.</p>
        <div class="city-links">
            ${Object.values(locations).map(l => `<a href="/local/${l.slug}" class="city-tag">${l.name}</a>`).join('')}
        </div>
    </footer>
</body>
</html>
    `;
    res.send(html);
});

export default router;
