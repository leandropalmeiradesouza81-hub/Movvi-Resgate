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
    <title>${loc.name} News | Guia de Bairros e Reboque 24h | Movvi Resgate</title>
    <meta name="description" content="Tudo o que acontece em ${loc.name}. Notícias do trânsito, guias locais e o reboque particular mais barato do Rio. Movvi Resgate." />
    <link rel="canonical" href="https://movviresgate.com.br/local/${loc.slug}" />
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
    <style>
        :root { --primary: #ffd900; --text: #1a1a1a; --muted: #666; --bg: #ffffff; }
        body { font-family: 'Inter', sans-serif; background: #fefefe; color: var(--text); margin: 0; line-height: 1.6; }
        
        header { 
            background: #fff; 
            padding: 20px 5%; 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            box-shadow: 0 4px 30px rgba(0,0,0,0.03);
            position: sticky;
            top: 0;
            z-index: 1000;
        }
        .header-brand { font-family: 'Outfit'; font-weight: 950; color: #000; font-size: 1.1rem; text-transform: uppercase; letter-spacing: 2px; }
        .logo { height: 75px; object-fit: contain; }

        .hero { 
            background: linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1600&q=80');
            background-size: cover;
            background-position: center;
            padding: 80px 5%;
            text-align: center;
            border-bottom: 6px solid var(--primary);
        }
        .hero h1 { font-family: 'Outfit'; font-size: clamp(38px, 9vw, 90px); font-weight: 950; margin: 0; line-height: 0.95; color: #000; letter-spacing: -0.04em; }
        .hero p { font-size: 1.3rem; color: #444; max-width: 650px; margin: 30px auto; font-weight: 600; }

        .container { max-width: 1200px; margin: 0 auto; padding: 40px 5%; }
        
        .emergency-banner { 
            background: #000; 
            color: #fff;
            padding: 40px; 
            border-radius: 30px; 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            margin-top: -100px; 
            position: relative; 
            z-index: 10;
            box-shadow: 0 40px 80px rgba(0, 0, 0, 0.2);
        }
        .emergency-banner h2 { margin: 0; font-family: 'Outfit'; font-size: clamp(22px, 5vw, 32px); color: var(--primary); font-weight: 900; }
        .btn-call { background: var(--primary); color: #000; padding: 20px 45px; border-radius: 18px; text-decoration: none; font-weight: 900; text-transform: uppercase; white-space: nowrap; font-size: 16px; border: 3px solid #000; transition: 0.3s; }
        .btn-call:hover { transform: scale(1.05); }

        .section-title { font-family: 'Outfit'; font-size: 2.8rem; font-weight: 950; margin: 80px 0 50px; text-align: center; }
        .section-title span { background: var(--primary); padding: 0 15px; }

        .news-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 40px; }
        .news-card { background: #fff; border-radius: 35px; overflow: hidden; text-decoration: none; color: inherit; box-shadow: 0 20px 50px rgba(0,0,0,0.06); transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1); border: 1px solid #f0f0f0; display: flex; flex-direction: column; }
        .news-card:hover { transform: translateY(-15px); box-shadow: 0 40px 100px rgba(0,0,0,0.12); }
        .news-img-container { width: 100%; height: 260px; overflow: hidden; background: #eee; }
        .news-img { width: 100%; height: 100%; object-fit: cover; transition: 0.6s; }
        .news-card:hover .news-img { transform: scale(1.1); }
        
        .news-body { padding: 35px; flex-grow: 1; display: flex; flex-direction: column; }
        .news-source { font-size: 11px; font-weight: 900; color: #000; background: var(--primary); padding: 5px 15px; border-radius: 99px; display: inline-block; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px; align-self: flex-start; }
        .news-title { font-family: 'Outfit'; font-size: 1.6rem; font-weight: 900; line-height: 1.25; margin: 0; color: #000; letter-spacing: -0.02em; }
        .news-excerpt { font-size: 1rem; color: #666; margin: 15px 0; display: none; }
        .read-more { margin-top: auto; padding-top: 20px; font-weight: 800; font-size: 13px; text-transform: uppercase; color: var(--primary-dark); letter-spacing: 1px; }

        /* Featured Card logic */
        .card-featured { grid-column: 1 / -1; flex-direction: row; min-height: 450px; }
        .card-featured .news-img-container { width: 60%; height: auto; min-height: 450px; }
        .card-featured .news-body { width: 40%; padding: 60px; justify-content: center; }
        .card-featured .news-title { font-size: 2.8rem; }
        .card-featured .news-excerpt { display: block; }

        @media (max-width: 1024px) {
            .card-featured { flex-direction: column; }
            .card-featured .news-img-container { width: 100%; height: 350px; min-height: auto; }
            .card-featured .news-body { width: 100%; padding: 40px; }
            .card-featured .news-title { font-size: 2.2rem; }
        }

        @media (max-width: 900px) {
            .news-grid { grid-template-columns: 1fr; }
            .card-featured .news-title { font-size: 1.8rem; }
        }

        .guide-footer { background: #fff; padding: 100px 5%; margin-top: 100px; border-radius: 60px 60px 0 0; text-align: center; box-shadow: 0 -40px 100px rgba(0,0,0,0.03); }
        .guide-footer h3 { font-family: 'Outfit'; font-size: 3.2rem; font-weight: 950; margin-bottom: 30px; letter-spacing: -0.04em; }
        .guide-footer p { font-size: 1.2rem; color: #555; line-height: 1.8; max-width: 850px; margin: 0 auto 50px; }

        footer { background: #000; color: #fff; padding: 100px 5%; text-align: center; }
        .footer-logo { height: 50px; margin-bottom: 40px; filter: grayscale(1) brightness(2); }
        .tag-cloud { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin-top: 50px; }
        .tag { color: #555; text-decoration: none; font-size: 12px; border: 1px solid #222; padding: 8px 20px; border-radius: 99px; font-weight: 600; }
        .tag:hover { color: var(--primary); border-color: var(--primary); }

        @media (max-width: 900px) {
            .emergency-banner { flex-direction: column; text-align: center; gap: 30px; }
            .news-grid { grid-template-columns: 1fr; }
            .hero h1 { font-size: 3.5rem; }
        }
    </style>
</head>
<body>
    <header>
        <div class="header-brand">${loc.name} NEWS PORTAL</div>
        <a href="https://movviresgate.com.br">
            <img src="https://movviresgate.com.br/assets/images/logo_movvi.png" alt="Movvi Resgate" class="logo" onerror="this.onerror=null; this.src='https://movviresgate.com.br/assets/images/logo_movvi_icon.png';">
        </a>
    </header>

    <section class="hero">
        <h1>${loc.name}<br><span>NOTÍCIAS</span></h1>
        <p>Informativo local oficial com atualizações em tempo real e assistência 24h para você nunca ficar na mão.</p>
    </section>

    <div class="container">
        <div class="emergency-banner">
            <div>
                <h2>Problemas com o carro em ${loc.name}?</h2>
                <p style="margin: 8px 0 0; color: #888; font-size: 18px;">Socorro mecânico pronto em 15 minutos.</p>
            </div>
            <a href="https://movviresgate.com.br" class="btn-call">CHAMAR AGORA</a>
        </div>

        <h2 class="section-title">Acontece em <span>${loc.name}</span></h2>

        <div class="news-blog">
            ${news.length ? `
                <div class="news-grid">
                    ${news.map((n, index) => `
                        <a href="/local/${loc.slug}/noticia/${n.slug}" class="news-card ${index === 0 ? 'card-featured' : ''}">
                            <div class="news-img-container">
                                <img src="${n.image}" alt="${n.title}" class="news-img" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80';">
                            </div>
                            <div class="news-body">
                                <span class="news-source">${n.source} • ${n.timeAgo}</span>
                                <h3 class="news-title">${n.title}</h3>
                                ${index === 0 ? `<p class="news-excerpt">Acompanhe esta atualização importante sobre o trânsito e acontecimentos em ${loc.name}. A Movvi Resgate traz os detalhes para você dirigir com segurança.</p>` : ''}
                                <span class="read-more">Ler matéria completa →</span>
                            </div>
                        </a>
                    `).join('')}
                </div>
            ` : `
                <div style="grid-column: 1/-1; text-align: center; padding: 120px 0; color: #888; background: #fff; border-radius: 30px;">
                    <h3 style="font-family: 'Outfit'; font-size: 24px; color: #000;">Buscando notícias frescas...</h3>
                    <p>Estamos conectando com os portais regionais para trazer as últimas de <strong>${loc.name}</strong>.</p>
                </div>
            `}
        </div>
    </div>

    <section class="guide-footer">
        <h3>Guia de Bairros Oficial</h3>
        <p>${loc.description}</p>
        <p>A Movvi Resgate entende que o trânsito no Rio de Janeiro não espera. Por isso, mantemos uma rede ativa de motoristas resgatistas em ${loc.name} para garantir que você tenha um socorro digno, rápido e justo sempre que precisar.</p>
        <a href="https://movviresgate.com.br" class="btn-call" style="display: inline-block;">VER TABELA DE PREÇOS</a>
    </section>

    <footer>
        <img src="https://movviresgate.com.br/assets/images/logo_movvi.png" alt="Movvi" class="footer-logo">
        <p style="opacity: 0.6; font-size: 14px; max-width: 500px; margin: 0 auto 40px;">Socorro veicular inteligente. O reboque no cambão que é a cara do Rio de Janeiro.</p>
        <div class="tag-cloud">
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
        body { font-family: 'Inter', sans-serif; margin: 0; background: #fbfbfb; color: #111; }
        
        header { background: #fff; padding: 25px 5%; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; position: sticky; top: 0; z-index: 1000; }
        .logo { height: 50px; }
        .btn-back { color: #000; text-decoration: none; font-weight: 800; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }

        .container { max-width: 900px; margin: 60px auto; background: #fff; border-radius: 40px; box-shadow: 0 50px 120px rgba(0,0,0,0.05); overflow: hidden; }
        .article-img { width: 100%; height: 500px; object-fit: cover; }
        .article-body { padding: 60px; }
        .article-meta { color: #888; font-size: 12px; font-weight: 900; text-transform: uppercase; margin-bottom: 25px; display: block; border-bottom: 2px solid var(--primary); width: fit-content; padding-bottom: 5px; }
        .article-title { font-family: 'Outfit'; font-size: clamp(32px, 6vw, 54px); font-weight: 950; color: #000; line-height: 1.05; margin-bottom: 40px; letter-spacing: -0.04em; }
        .article-content { font-size: 1.2rem; line-height: 1.9; color: #333; }
        
        .movvi-ad { background: #000; color: #fff; padding: 45px; border-radius: 25px; margin: 70px 0; text-align: center; border: 4px solid var(--primary); box-shadow: 0 40px 80px rgba(0,0,0,0.2); }
        .movvi-ad h4 { font-family: 'Outfit'; font-size: 36px; margin: 0 0 15px; color: var(--primary); font-weight: 900; }
        .movvi-ad p { font-size: 1.2rem; opacity: 0.9; margin-bottom: 30px; }
        .btn-movvi { display: inline-block; background: var(--primary); color: #000; padding: 20px 50px; border-radius: 15px; font-weight: 950; text-decoration: none; font-size: 18px; text-transform: uppercase; transition: 0.3s; }

        @media (max-width: 768px) {
            .article-body { padding: 35px; }
            .article-img { height: 300px; }
            .article-title { font-size: 34px; }
        }
    </style>
</head>
<body>
    <header>
        <a href="/local/${loc.slug}"><span class="btn-back">← Voltar</span></a>
        <a href="https://movviresgate.com.br">
            <img src="https://movviresgate.com.br/assets/images/logo_movvi.png" alt="Movvi" class="logo" onerror="this.onerror=null; this.src='https://movviresgate.com.br/assets/images/logo_movvi_icon.png';">
        </a>
    </header>

    <article class="container">
        <img src="${item.image}" alt="${item.title}" class="article-img" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1544620347-c4fd4a3d5947?w=500&q=80'">
        <div class="article-body">
            <span class="article-meta">ATUALIZAÇÃO: ${item.source} • ${item.timeAgo}</span>
            <h1 class="article-title">${item.title}</h1>
            
            <div class="article-content">
                <p>Notícia vinda diretamente dos canais oficiais para os moradores de ${loc.name}. A Movvi Resgate mantém este portal ativo para informar e proteger os motoristas da região.</p>
                
                <div class="movvi-ad">
                    <h4>Enguiçou em ${loc.name}?</h4>
                    <p>O Reboque Particular mais barato e rápido do Rio. Chegamos em minutos.</p>
                    <a href="https://movviresgate.com.br" class="btn-movvi">REBOQUE R$ 80</a>
                </div>

                <p>A segurança viária em ${loc.name} é nossa prioridade. Se notar qualquer bloqueio ou precisar de assistência, conte com nossa rede de motoristas parceiros.</p>
                
                <a href="${item.link}" target="_blank" style="color: #666; font-size: 14px; text-decoration: underline; display: block; margin-top: 40px;">Ler matéria original no portal ${item.source}</a>
            </div>
        </div>
    </article>

    <footer style="text-align: center; padding: 80px; color: #888; font-size: 14px;">
        <p>&copy; 2026 Movvi Resgate - Inteligência Logística em ${loc.name}.</p>
    </footer>
</body>
</html>
    `;
    res.send(html);
});

export default router;
