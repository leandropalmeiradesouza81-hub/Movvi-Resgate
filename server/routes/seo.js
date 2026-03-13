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
        :root { --primary: #ffd900; --bg: #f8f8f6; --text: #0a0a0a; --card-bg: #ffffff; }
        body { font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); margin: 0; line-height: 1.6; }
        
        .header-main { background: #000; color: #fff; border-bottom: 6px solid var(--primary); padding: 15px 40px; }
        .nav-container { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
        .logo-main { height: 50px; display: block; }
        .badge-city { background: var(--primary); color: #000; padding: 4px 14px; border-radius: 6px; font-family: 'Outfit'; font-weight: 900; font-size: 13px; text-transform: uppercase; }
        
        .hero-v3 { background: #000; color: #fff; padding: 60px 24px; text-align: center; }
        .news-badge { font-family: 'Outfit', sans-serif; font-size: 38px; font-weight: 900; color: var(--primary); text-transform: uppercase; letter-spacing: 1px; margin-top: 10px; }
        
        .container { max-width: 1100px; margin: 0 auto; padding: 60px 24px; }
        
        .emergency-pill { background: #fff; border: 2px solid var(--primary); color: #000; padding: 25px; border-radius: 20px; display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 60px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .pill-text h2 { margin: 0; font-family: 'Outfit'; font-size: 24px; color: #000; }
        .pill-btn { background: #000; color: #fff; padding: 12px 30px; border-radius: 12px; font-weight: 800; text-decoration: none; text-transform: uppercase; font-size: 13px; }
        
        .section-title { font-family: 'Outfit'; font-size: 32px; font-weight: 900; margin-bottom: 40px; display: flex; align-items: center; gap: 15px; }
        .section-title::after { content: ''; flex: 1; height: 3px; background: #eee; }
        
        .news-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(450px, 1fr)); gap: 30px; }
        .news-card { background: var(--card-bg); border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.03); border: 1px solid #eee; display: flex; flex-direction: column; }
        .news-card:hover { transform: translateY(-5px); box-shadow: 0 15px 40px rgba(0,0,0,0.08); transition: 0.3s ease; }
        .news-img-box { width: 100%; height: 240px; overflow: hidden; position: relative; background: #eee; }
        .news-img { width: 100%; height: 100%; object-fit: cover; }
        .news-content { padding: 25px; flex-grow: 1; }
        .news-meta { font-size: 11px; font-weight: 800; color: var(--primary); background: #000; padding: 3px 10px; border-radius: 4px; display: inline-block; margin-bottom: 15px; text-transform: uppercase; }
        .news-title { font-family: 'Outfit'; font-size: 21px; font-weight: 800; line-height: 1.3; margin-bottom: 15px; color: #000; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .news-desc { font-size: 15px; color: #555; margin-bottom: 20px; }
        .news-footer { border-top: 1px solid #f5f5f5; padding: 15px 25px; background: #fafafa; display: flex; justify-content: space-between; align-items: center; }
        .news-link { color: #000; font-weight: 800; font-size: 13px; text-decoration: none; border-bottom: 2px solid var(--primary); }
        
        .info-card { background: #000; color: #fff; padding: 50px; border-radius: 30px; margin-top: 80px; text-align: center; }
        .info-card h2 { font-family: 'Outfit'; font-size: 36px; color: var(--primary); margin-top: 0; }
        
        .footer-minimal { background: #fff; border-top: 1px solid #eee; padding: 60px 40px; text-align: center; color: #888; }
        .tag-cloud { margin-top: 30px; display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
        .tag-item { font-size: 11px; padding: 5px 15px; background: #f0f0f0; border-radius: 99px; text-decoration: none; color: #666; }
        .tag-item:hover { background: var(--primary); color: #000; }

        @media (max-width: 600px) {
            .news-grid { grid-template-columns: 1fr; }
            .pill-btn { width: 100%; text-align: center; }
            .emergency-pill { flex-direction: column; text-align: center; }
        }
    </style>
</head>
<body>
    <header class="header-main">
        <div class="nav-container">
            <a href="https://movviresgate.com.br"><img src="/assets/images/logo_movvi.png" alt="Movvi Resgate" class="logo-main"></a>
            <div class="badge-city">GUIA DE BAIRROS</div>
        </div>
    </header>

    <div class="hero-v3">
        <div class="news-badge">${loc.name} News</div>
        <p style="font-size: 18px; color: #888; max-width: 600px; margin: 10px auto;">Informação local e trânsito em tempo real para os moradores de ${loc.name}.</p>
    </div>

    <main class="container">
        <div class="emergency-pill">
            <div class="pill-text">
                <h2>Enguiçou em ${loc.name}?</h2>
                <p>O <strong>Reboque Perto de Mim</strong> mais rápido do Rio. Chegamos em 15 minutos.</p>
            </div>
            <a href="https://movviresgate.com.br" class="pill-btn">CHAMAR AGORA</a>
        </div>

        <h2 class="section-title">Acontece em ${loc.name}</h2>

        <div class="news-grid">
            ${news.length ? news.map(n => `
                <article class="news-card">
                    <div class="news-img-box">
                        <img src="${n.image}" alt="${n.title}" class="news-img" onerror="this.src='https://images.unsplash.com/photo-1544620347-c4fd4a3d5947?w=500&q=80'">
                    </div>
                    <div class="news-content">
                        <span class="news-meta">${n.source} • ${n.timeAgo}</span>
                        <h3 class="news-title">${n.title}</h3>
                        <p class="news-desc">Atualização importante para quem circula pelas vias de ${loc.name}. A Movvi Resgate monitora as principais rotas da região.</p>
                        <a href="${n.link}" target="_blank" class="news-link">LER MATÉRIA COMPLETA</a>
                    </div>
                </article>
            `).join('') : '<p>Estamos buscando as notícias mais recentes para você...</p>'}
        </div>

        <section class="info-card">
            <h2>Movvi Resgate em ${loc.name}</h2>
            <p style="font-size: 18px; opacity: 0.9; line-height: 1.8;">
                Se você está na região de <strong>${loc.name}</strong>, a Movvi Resgate é sua aliada número 1. 
                Com uma rede exclusiva de motoristas parceiros prontos para atuar via barra rígida (reboque cambão), 
                garantimos um socorro rápido, seguro e com o preço mais competitivo do Rio de Janeiro. 
                Não fique parado no trânsito, chame quem entende do subúrbio carioca.
            </p>
            <a href="https://movviresgate.com.br" class="pill-btn" style="background: var(--primary); color: #000; margin-top: 20px;">PEDIR REBOQUE</a>
        </section>

        <div class="tag-cloud">
            ${Object.values(locations).map(l => `<a href="/local/${l.slug}" class="tag-item">Reboque em ${l.name}</a>`).join('')}
        </div>
    </main>

    <footer class="footer-minimal">
        <p>&copy; 2026 Movvi Resgate. A solução inteligente para reboque e guincho 24h.</p>
        <p style="font-size: 11px;">As notícias exibidas são de responsabilidade de seus respectivos portais (G1, R7, O Globo).</p>
    </footer>
</body>
</html>
    `;
    res.send(html);
});

export default router;
