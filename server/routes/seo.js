import { Router } from 'express';
import { getTrafficNews } from '../services/newsService.js';

const router = Router();

export const locations = {
    'nilopolis': { name: 'Nilópolis', slug: 'nilopolis', description: 'Guia de Nilópolis: Onde o trânsito flui e o Reboque Movvi chega em minutos na Getúlio de Moura.' },
    'sao-joao-de-meriti': { name: 'São João de Meriti', slug: 'sao-joao-de-meriti', description: 'Socorro em São João de Meriti. Cobertura total na Dutra, Vilar dos Teles e Centro com guincho barato.' },
    'nova-iguacu': { name: 'Nova Iguaçu', slug: 'nova-iguacu', description: 'Central de Reboque Nova Iguaçu. Atendimento 24h na Via Light, Centro e Posse.' },
    'rio-de-janeiro': { name: 'Rio de Janeiro', slug: 'rio-de-janeiro', description: 'O maior guia de socorro do Rio de Janeiro. Guincho particular em todos os bairros da capital.' },
    'caxias': { name: 'Duque de Caxias', slug: 'caxias', description: 'Reboque em Duque de Caxias. Socorro mecânico 24h na Washington Luiz e todos os distritos.' },
    'belford-roxo': { name: 'Belford Roxo', slug: 'belford-roxo', description: 'Guincho rápido em Belford Roxo. Atendimento em Areia Branca, Heliópolis e Centro.' },
    'campo-grande': { name: 'Campo Grande', slug: 'campo-grande', description: 'Socorro veicular em Campo Grande RJ. A maior rede de reboque da Zona Oeste.' },
    'jacarepagua': { name: 'Jacarepaguá', slug: 'jacarepagua', description: 'Reboque em Jacarepaguá. Atendimento na Taquara, Freguesia e Anil em até 15 min.' },
    'zona-norte': { name: 'Zona Norte', slug: 'zona-norte', description: 'Portal de notícias e reboque na Zona Norte do Rio. Socorro 24h em toda a região.' },
    // Zona Norte & Subúrbios expansion
    'madureira': { name: 'Madureira', slug: 'madureira', description: 'Guia de Madureira: Notícias do trânsito no Mercadão e reboque 24h para todo o subúrbio.' },
    'pavuna': { name: 'Pavuna', slug: 'pavuna', description: 'Socorro mecânico na Pavuna. Reboque rápido na linha verde e arredores da estação.' },
    'meier': { name: 'Méier', slug: 'meier', description: 'Portal Méier News: Trânsito na Dias da Cruz e reboque particular econômico 24h.' },
    'tijuca': { name: 'Tijuca', slug: 'tijuca', description: 'Serviço de guincho na Tijuca. Atendimento na Praça Saens Peña e Conde de Bonfim.' },
    'grajau': { name: 'Grajaú', slug: 'grajau', description: 'Reboque no Grajaú. Socorro rápido em um dos bairros mais tradicionais da Zona Norte.' },
    'vila-isabel': { name: 'Vila Isabel', slug: 'vila-isabel', description: 'Guia de Vila Isabel: Samba, notícias e reboque 24h na Boulevard 28 de Setembro.' },
    'engenho-de-dentro': { name: 'Engenho de Dentro', slug: 'engenho-de-dentro', description: 'Socorro veicular próximo ao Engenhão. Reboque 24h no Engenho de Dentro.' },
    'iraja': { name: 'Irajá', slug: 'iraja', description: 'Reboque em Irajá. Atendimento imediato na Av. Brasil e redondezas do CEASA.' },
    'penha': { name: 'Penha', slug: 'penha', description: 'Portal Penha News: Notícias da região e guincho barato para toda a Leopoldina.' },
    'bonsucesso': { name: 'Bonsucesso', slug: 'bonsucesso', description: 'Socorro mecânico em Bonsucesso. Agilidade extrema para quem enguiça na Av. Brasil.' },
    'ramos': { name: 'Ramos', slug: 'ramos', description: 'Reboque em Ramos. O socorro mais tradicional da Zona Norte agora digital.' },
    'olaria': { name: 'Olaria', slug: 'olaria', description: 'Guia de Olaria: Trânsito e assistência veicular 24h com preço justo.' },
    'ilha-do-governador': { name: 'Ilha do Governador', slug: 'ilha-do-governador', description: 'Reboque na Ilha do Governador. Socorro rápido no Galeão, Cocotá e Portuguesa.' },
    'marechal-hermes': { name: 'Marechal Hermes', slug: 'marechal-hermes', description: 'Socorro em Marechal Hermes. Guincho barato para o bairro operário mais famoso do Rio.' },
    'bento-ribeiro': { name: 'Bento Ribeiro', slug: 'bento-ribeiro', description: 'Assistência veicular em Bento Ribeiro. Reboque Movvi sempre por perto.' },
    'cascadura': { name: 'Cascadura', slug: 'cascadura', description: 'Guia de Cascadura: Notícias e socorro 24h no coração da Zona Norte.' },
    'guadalupe': { name: 'Guadalupe', slug: 'guadalupe', description: 'Reboque em Guadalupe. Socorro rápido na Av. Brasil e Shopping Jardim Guadalupe.' },
    'vicente-de-carvalho': { name: 'Vicente de Carvalho', slug: 'vicente-de-carvalho', description: 'Socorro veicular em Vicente de Carvalho. Atendimento ágil próximo ao metrô.' },
    'rocha-miranda': { name: 'Rocha Miranda', slug: 'rocha-miranda', description: 'Reboque em Rocha Miranda. Agilidade e preço baixo para o seu socorro.' },
    'deodoro': { name: 'Deodoro', slug: 'deodoro', description: 'Assistência técnica em Deodoro. Reboque particular para quem circula pela Transolímpica.' },
    'piedade': { name: 'Piedade', slug: 'piedade', description: 'Guia de Piedade News: Notícias locais e reboque rápido 24 horas por dia.' }
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

router.get('/:citySlug', async (req, res) => {
    const loc = locations[req.params.citySlug];
    if (!loc) return res.status(404).send('Localidade não encontrada');

    const news = await getTrafficNews(loc.name);

    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Guia ${loc.name} | Notícias e Reboque 24h | Movvi Resgate</title>
    <meta name="description" content="Guia Oficial de ${loc.name}. Notícias do trânsito, acontecimentos e o Reboque Particular mais barato do RJ. Chame a Movvi!" />
    <link rel="canonical" href="https://movviresgate.com.br/local/${loc.slug}" />
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
    <style>
        :root { --primary: #ffd900; --accent: #ff0033; --bg: #ffffff; --card-bg: #f9f9f9; --text: #050505; }
        body { font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); margin: 0; line-height: 1.5; }
        
        header { background: #000; padding: 15px 5%; border-bottom: 5px solid var(--primary); position: sticky; top: 0; z-index: 1000; display: flex; justify-content: space-between; align-items: center; }
        .logo { height: 45px; }
        .nav-brand { font-family: 'Outfit'; font-weight: 900; color: var(--primary); font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }

        .hero-banner { background: #000; color: #fff; padding: 80px 5% 120px; text-align: left; position: relative; overflow: hidden; }
        .hero-banner h1 { font-family: 'Outfit'; font-size: clamp(40px, 10vw, 82px); font-weight: 900; margin: 0; color: var(--primary); line-height: 0.9; text-transform: uppercase; }
        .hero-banner p { font-size: 20px; color: #888; margin-top: 20px; max-width: 600px; }
        .hero-badge { background: var(--accent); color: white; padding: 5px 15px; border-radius: 4px; font-weight: 900; font-size: 12px; display: inline-block; margin-bottom: 20px; }

        .container { max-width: 1200px; margin: 0 auto; padding: 0 5%; }
        
        .emergency-bar { background: var(--primary); margin-top: -60px; padding: 30px; border-radius: 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 30px 60px rgba(0,0,0,0.1); position: relative; z-index: 10; }
        .emergency-bar h2 { margin: 0; font-family: 'Outfit'; font-size: clamp(18px, 4vw, 24px); color: #000; font-weight: 800; }
        .btn-call { background: #000; color: #fff; padding: 15px 30px; border-radius: 12px; text-decoration: none; font-weight: 800; text-transform: uppercase; font-size: 14px; white-space: nowrap; }

        .section-header { margin: 80px 0 40px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
        .section-header h2 { font-family: 'Outfit'; font-size: 32px; font-weight: 900; margin: 0; }
        
        .news-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 30px; }
        .news-card { background: var(--card-bg); border-radius: 24px; overflow: hidden; text-decoration: none; color: inherit; transition: 0.4s; display: flex; flex-direction: column; }
        .news-card:hover { transform: translateY(-10px); box-shadow: 0 40px 80px rgba(0,0,0,0.1); }
        .news-image { width: 100%; height: 240px; object-fit: cover; }
        .news-body { padding: 25px; flex-grow: 1; }
        .news-source { font-size: 11px; font-weight: 900; color: var(--accent); text-transform: uppercase; margin-bottom: 12px; display: block; }
        .news-title { font-family: 'Outfit'; font-size: 20px; font-weight: 800; line-height: 1.3; margin: 0; color: #000; }

        .neighborhood-guide { background: #f4f4f4; padding: 100px 5%; margin-top: 100px; border-radius: 50px 50px 0 0; text-align: center; }
        .guide-content { max-width: 800px; margin: 0 auto; }
        .guide-content h3 { font-family: 'Outfit'; font-size: 42px; font-weight: 900; margin-bottom: 25px; }
        .guide-content p { font-size: 18px; line-height: 1.8; color: #444; margin-bottom: 30px; }
        .btn-reboque { display: inline-block; background: var(--primary); color: #000; padding: 18px 45px; border-radius: 15px; font-weight: 900; text-decoration: none; text-transform: uppercase; }

        footer { background: #000; color: #fff; padding: 80px 5%; text-align: center; }
        .footer-logo { height: 40px; margin-bottom: 30px; opacity: 0.5; }
        .tags { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin-top: 40px; }
        .tag { color: #555; text-decoration: none; font-size: 11px; border: 1px solid #222; padding: 5px 15px; border-radius: 99px; }
        .tag:hover { color: var(--primary); border-color: var(--primary); }

        @media (max-width: 768px) {
            .news-grid { grid-template-columns: 1fr; }
            .emergency-bar { flex-direction: column; text-align: center; gap: 20px; }
            .hero-banner { padding-top: 50px; }
        }
    </style>
</head>
<body>
    <header>
        <a href="https://movviresgate.com.br"><img src="/assets/images/logo_movvi.png" alt="Movvi" class="logo"></a>
        <div class="nav-brand">${loc.name} NEWS PORTAL</div>
    </header>

    <section class="hero-banner">
        <div class="hero-badge">DIRETAMENTE DE ${loc.name.toUpperCase()}</div>
        <h1>${loc.name} News</h1>
        <p>Tudo o que acontece na sua região, com o olhar de quem cuida do trânsito do Rio.</p>
    </section>

    <div class="container">
        <div class="emergency-bar">
            <h2>Enguiçou aqui em ${loc.name}?</h2>
            <a href="https://movviresgate.com.br" class="btn-call">PEÇA REBOQUE R$ 80</a>
        </div>

        <div class="section-header">
            <h2>Últimos Acontecimentos</h2>
        </div>

        <div class="news-grid">
            ${news.map(n => `
                <a href="/local/${loc.slug}/noticia/${n.slug}" class="news-card">
                    <img src="${n.image}" alt="${n.title}" class="news-image" onerror="this.src='https://images.unsplash.com/photo-1544620347-c4fd4a3d5947?w=500&q=80'">
                    <div class="news-body">
                        <span class="news-source">${n.source} • ${n.timeAgo}</span>
                        <h3 class="news-title">${n.title}</h3>
                    </div>
                </a>
            `).join('')}
        </div>
    </div>

    <section class="neighborhood-guide">
        <div class="guide-content">
            <h3>Guia de Bairros: ${loc.name}</h3>
            <p>${loc.description}</p>
            <p>A Movvi Resgate é a parceira oficial do motorista em ${loc.name}. Com atendimento especializado e motoristas locais, garantimos a melhor experiência em socorro veicular.</p>
            <a href="https://movviresgate.com.br" class="btn-reboque">Pedir Socorro Agora</a>
        </div>
    </section>

    <footer>
        <img src="/assets/images/logo_movvi.png" alt="Movvi" class="footer-logo">
        <p>&copy; 2026 Movvi Resgate - Inteligência Logística 24h.</p>
        <div class="tags">
            ${Object.values(locations).map(l => `<a href="/local/${l.slug}" class="tag">${l.name}</a>`).join('')}
        </div>
    </footer>
</body>
</html>
    `;
    res.send(html);
});

router.get('/:citySlug/noticia/:newsSlug', async (req, res) => {
    const loc = locations[req.params.citySlug];
    if (!loc) return res.status(404).send('Localidade não encontrada');

    const allNews = await getTrafficNews(loc.name);
    const item = allNews.find(n => n.slug === req.params.newsSlug);

    if (!item) return res.status(404).send('Notícia não encontrada');

    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${item.title} | ${loc.name} News</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
    <style>
        :root { --primary: #ffd900; --bg: #ffffff; --text: #111; }
        body { font-family: 'Inter', sans-serif; margin: 0; background: #fafafa; }
        header { background: #000; padding: 20px 5%; display: flex; justify-content: space-between; align-items: center; border-bottom: 5px solid var(--primary); position: sticky; top: 0; z-index: 1000; }
        .logo { height: 40px; }
        .btn-back { color: var(--primary); text-decoration: none; font-weight: 700; font-size: 14px; text-transform: uppercase; }

        .container { max-width: 800px; margin: 60px auto; padding: 0; background: #fff; border-radius: 30px; box-shadow: 0 40px 100px rgba(0,0,0,0.05); overflow: hidden; }
        .article-img { width: 100%; height: 450px; object-fit: cover; }
        .article-body { padding: 50px; }
        .article-meta { color: #888; font-size: 12px; font-weight: 800; text-transform: uppercase; margin-bottom: 20px; display: block; }
        .article-title { font-family: 'Outfit'; font-size: clamp(28px, 5vw, 42px); font-weight: 900; color: #000; line-height: 1.1; margin-bottom: 30px; }
        .article-content { font-size: 18px; line-height: 1.8; color: #333; }
        
        .movvi-ad { background: #000; color: #fff; padding: 40px; border-radius: 20px; margin: 60px 0; text-align: center; position: relative; overflow: hidden; border: 4px solid var(--primary); }
        .movvi-ad h4 { font-family: 'Outfit'; font-size: 28px; margin: 0 0 15px; color: var(--primary); text-transform: uppercase; }
        .movvi-ad p { font-size: 18px; opacity: 0.9; margin-bottom: 25px; }
        .btn-movvi { display: inline-block; background: var(--primary); color: #000; padding: 15px 40px; border-radius: 12px; font-weight: 900; text-decoration: none; text-transform: uppercase; }

        @media (max-width: 768px) {
            .article-body { padding: 30px; }
            .article-img { height: 250px; }
        }
    </style>
</head>
<body>
    <header>
        <a href="/local/${loc.slug}"><span class="btn-back">← Voltar para ${loc.name}</span></a>
        <a href="https://movviresgate.com.br"><img src="/assets/images/logo_movvi.png" alt="Movvi" class="logo"></a>
    </header>

    <article class="container">
        <img src="${item.image}" alt="${item.title}" class="article-img" onerror="this.src='https://images.unsplash.com/photo-1544620347-c4fd4a3d5947?w=500&q=80'">
        <div class="article-body">
            <span class="article-meta">FONTE: ${item.source} • ${item.timeAgo}</span>
            <h1 class="article-title">${item.title}</h1>
            
            <div class="article-content">
                <p>Notícia vinda diretamente dos canais oficiais de trânsito e segurança. A Movvi Resgate monitora constantemente os incidentes em ${loc.name} para garantir agilidade no atendimento.</p>
                
                <div class="movvi-ad">
                    <h4>Precisa de Reboque em ${loc.name}?</h4>
                    <p>O socorro mais barato e rápido do Rio de Janeiro. Chegamos em até 15 minutos.</p>
                    <a href="https://movviresgate.com.br" class="btn-movvi">REBOQUE AGORA - R$ 80</a>
                </div>

                <p>Mantenha-se informado e dirija com segurança. Se precisar de assistência técnica ou reboque particular, chame a Movvi.</p>
                
                <a href="${item.link}" target="_blank" style="color: grey; font-size: 14px; text-decoration: underline;">Ver notícia completa no portal ${item.source}</a>
            </div>
        </div>
    </article>

    <footer style="text-align: center; padding: 60px; color: #888; font-size: 13px;">
        <p>&copy; 2026 Movvi Resgate - Sua proteção em ${loc.name}.</p>
    </footer>
</body>
</html>
    `;
    res.send(html);
});

export default router;
