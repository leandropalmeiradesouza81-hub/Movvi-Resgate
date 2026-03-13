import { Router } from 'express';
import { getTrafficNews } from '../services/newsService.js';

const router = Router();

const locations = {
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

router.get('/sitemap.xml', (req, res) => {
    const baseUrl = 'https://movviresgate.com.br';
    const staticPages = ['', '/convite.html', '/client.html', '/driver.html'];
    const localPages = Object.keys(locations).map(slug => `/local/${slug}`);
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    
    [...staticPages, ...localPages].forEach(page => {
        xml += `<url><loc>${baseUrl}${page}</loc><changefreq>daily</changefreq><priority>${page === '' ? '1.0' : '0.8'}</priority></url>`;
    });
    
    xml += '</urlset>';
    res.header('Content-Type', 'application/xml');
    res.send(xml);
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
        .hero { background: #000; color: #fff; padding: 60px 24px; text-align: center; }
        .hero h1 { font-family: 'Outfit', sans-serif; font-size: clamp(32px, 8vw, 56px); color: var(--primary); margin-bottom: 20px; text-transform: uppercase; }
        .container { max-width: 900px; margin: 0 auto; padding: 40px 24px; }
        .cta-btn { display: inline-block; background: var(--primary); color: #000; padding: 18px 40px; border-radius: 99px; font-weight: 900; text-decoration: none; font-family: 'Outfit', sans-serif; font-size: 20px; margin-top: 30px; }
        .news-section { margin-top: 60px; background: #fff; padding: 40px; border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .news-card { border-bottom: 1px solid #eee; padding: 20px 0; }
        .news-card:last-child { border: none; }
        .news-tag { color: var(--primary); font-weight: 900; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
        .news-title { font-weight: 800; font-size: 18px; margin: 8px 0; color: #111; line-height: 1.3; }
        .news-link { color: #555; font-size: 13px; text-decoration: underline; }
        footer { padding: 40px; text-align: center; font-size: 13px; color: #888; border-top: 1px solid #eee; }
    </style>
</head>
<body>
    <header class="hero">
        <div class="container">
            <img src="/assets/images/logo_movvi.png" alt="Movvi Resgate" style="height: 45px; margin-bottom: 24px;">
            <h1>Reboque em ${loc.name}</h1>
            <p>Precisa de Guincho 24h? Atendimento imediato em ${loc.name} a partir de R$ 80.</p>
            <a href="https://movviresgate.com.br" class="cta-btn">PEDIR REBOQUE AGORA</a>
        </div>
    </header>

    <main class="container">
        <section>
            <h2>O melhor preço de ${loc.name}</h2>
            <p>A <strong>Movvi Resgate</strong> oferece o serviço de reboque particular mais acessível para quem está em ${loc.name}. Nosso sistema de reboque no cambão (barra rígida) permite que motoristas parceiros te socorram rapidamente por uma fração do preço de um guincho comum.</p>
        </section>

        <section class="news-section">
            <h2 style="font-family: 'Outfit'; border-bottom: 3px solid var(--primary); display: inline-block; padding-bottom: 5px;">Notícias de Trânsito em ${loc.name}</h2>
            <p style="font-size: 14px; color: #666; margin-bottom: 30px;">Fique por dentro do que acontece nas ruas de ${loc.name} e região. A Movvi Resgate está sempre atenta para garantir seu socorro.</p>
            
            ${news.length ? news.map(n => `
                <div class="news-card">
                    <span class="news-tag">${n.source} • ${n.timeAgo}</span>
                    <h3 class="news-title">${n.title}</h3>
                    <p style="font-size: 14px; color: #444; margin-bottom: 10px;">Informação relevante para quem circula por ${loc.name}. Em caso de imprevistos, chame o <strong>reboque da Movvi Resgate</strong>.</p>
                    <a href="${n.link}" target="_blank" class="news-link">Ler notícia completa no G1</a>
                </div>
            `).join('') : '<p>Buscando atualizações de trânsito em tempo real...</p>'}
        </section>
    </main>

    <footer>
        <p>&copy; 2026 Movvi Resgate - Especialista em Reboque e Guincho 24h.</p>
        <p>Atendimento em Rio de Janeiro, Baixada Fluminense e Grande Rio.</p>
    </footer>
</body>
</html>
    `;
    res.send(html);
});

export default router;
