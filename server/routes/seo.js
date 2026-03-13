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
    <title>Reboque e Guincho 24h em ${loc.name} | R$ 80 | Movvi Resgate</title>
    <meta name="description" content="${loc.description} Economize com o reboque mais barato do Rio." />
    <meta name="keywords" content="reboque ${loc.name}, guincho ${loc.name}, reboque perto de mim, guincho 24h, reboque barato, movvi resgate" />
    <link rel="canonical" href="https://movviresgate.com.br/local/${loc.slug}" />
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
    <style>
        :root { --primary: #ffd900; --bg: #fafaf7; --text: #111; }
        body { font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); margin: 0; line-height: 1.6; }
        .hero { background: #000; color: #fff; padding: 80px 24px; text-align: center; }
        .hero h1 { font-family: 'Outfit', sans-serif; font-size: clamp(32px, 8vw, 64px); color: var(--primary); margin-bottom: 20px; text-transform: uppercase; font-weight: 900; }
        .container { max-width: 1000px; margin: 0 auto; padding: 60px 24px; }
        .cta-btn { display: inline-block; background: var(--primary); color: #000; padding: 20px 48px; border-radius: 99px; font-weight: 900; text-decoration: none; font-family: 'Outfit', sans-serif; font-size: 22px; margin-top: 30px; }
        .news-section { margin-top: 80px; }
        .news-header { border-left: 6px solid var(--primary); padding-left: 20px; margin-bottom: 40px; }
        .news-header h2 { font-family: 'Outfit'; font-size: 32px; margin: 0; }
        .news-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; }
        .news-card { background: #fff; border-radius: 20px; padding: 30px; box-shadow: 0 10px 40px rgba(0,0,0,0.04); border: 1px solid #eee; transition: transform 0.3s; }
        .news-card:hover { transform: translateY(-5px); }
        .news-tag { color: var(--primary); font-weight: 900; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; display: block; margin-bottom: 12px; }
        .news-title { font-weight: 800; font-size: 19px; margin: 0 0 15px 0; color: #111; line-height: 1.4; font-family: 'Outfit'; }
        .news-desc { font-size: 15px; color: #555; margin-bottom: 20px; }
        .news-link { color: #000; font-size: 13px; font-weight: 700; text-decoration: none; border-bottom: 2px solid var(--primary); }
        footer { padding: 60px 40px; text-align: center; font-size: 14px; color: #888; border-top: 1px solid #eee; background: #fff; }
        .city-list { margin-top: 40px; display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }
        .city-link { font-size: 12px; color: #888; text-decoration: none; background: #eee; padding: 5px 12px; border-radius: 99px; }
    </style>
</head>
<body>
    <header class="hero">
        <div class="container">
            <img src="/assets/images/logo_movvi.png" alt="Movvi Resgate" style="height: 60px; margin-bottom: 30px;">
            <h1>Reboque em ${loc.name}</h1>
            <p style="font-size: 20px; opacity: 0.9;">Socorro 24h e Guincho Barato em toda região de ${loc.name}.</p>
            <a href="https://movviresgate.com.br" class="cta-btn">CHAMAR RESGATE AGORA</a>
        </div>
    </header>

    <main class="container">
        <section style="text-align: center; margin-bottom: 80px;">
            <h2 style="font-size: 36px; font-family: 'Outfit';">Atendimento em Minutos</h2>
            <p style="font-size: 18px; max-width: 700px; margin: 20px auto;">A <strong>Movvi Resgate</strong> revolucionou o socorro veicular. Se você está em ${loc.name}, temos motoristas parceiros equipados e prontos para te salvar de qualquer sufoco, com o melhor preço do mercado.</p>
        </section>

        <section class="news-section">
            <div class="news-header">
                <h2>Últimas Notícias e Trânsito: ${loc.name}</h2>
                <p>Informação em tempo real para quem circula por ${loc.name}. Atualizado a cada 24 horas.</p>
            </div>
            
            <div class="news-grid">
                ${news.length ? news.map(n => `
                    <div class="news-card">
                        <span class="news-tag">${n.source} • ${n.timeAgo}</span>
                        <h3 class="news-title">${n.title}</h3>
                        <p class="news-desc">Informação importante para a segurança viária em ${loc.name}. Se o seu veículo apresentar falhas nesta área, chame o <strong>Reboque Movvi</strong>.</p>
                        <a href="${n.link}" target="_blank" class="news-link">VER NOTÍCIA COMPLETA</a>
                    </div>
                `).join('') : '<p>Estamos buscando as notícias mais recentes para você...</p>'}
            </div>
        </section>

        <section style="margin-top: 100px; text-align: center; padding: 60px; background: #000; color: #fff; border-radius: 30px;">
            <h2 style="font-family: 'Outfit'; font-size: 40px; color: var(--primary);">Enguiçou em ${loc.name}?</h2>
            <p style="font-size: 20px; margin: 20px 0;">Não pague caro em guinchos tradicionais. Use a Movvi.</p>
            <a href="https://movviresgate.com.br" class="cta-btn">PEDIR SOCORRO AGORA</a>
        </section>

        <div class="city-list">
            ${Object.values(locations).map(l => `<a href="/local/${l.slug}" class="city-link">Reboque em ${l.name}</a>`).join('')}
        </div>
    </main>

    <footer>
        <p>&copy; 2026 Movvi Resgate - Inteligência em Assistência Veicular 24h.</p>
        <p>Rio de Janeiro | Baixada Fluminense | Grande Rio</p>
    </footer>
</body>
</html>
    `;
    res.send(html);
});

export default router;
