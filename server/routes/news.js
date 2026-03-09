import { Router } from 'express';

const router = Router();

// In-memory cache: { city, items, fetchedAt }
let newsCache = { city: '', items: [], fetchedAt: 0 };
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

router.get('/', async (req, res) => {
    const city = req.query.city || 'Rio de Janeiro';

    // Serve cache if fresh
    if (newsCache.city === city && Date.now() - newsCache.fetchedAt < CACHE_TTL) {
        return res.json({ items: newsCache.items, cached: true });
    }

    try {
        const query = encodeURIComponent(`${city} site:g1.globo.com OR site:g1.com.br when:1d`);
        const rssUrl = `https://news.google.com/rss/search?q=${query}&hl=pt-BR&gl=BR&ceid=BR:pt-419`;

        const resp = await fetch(rssUrl, {
            headers: { 'User-Agent': 'MovviResgate/1.0' }
        });

        if (!resp.ok) throw new Error(`RSS fetch failed: ${resp.status}`);

        const xml = await resp.text();

        // Simple XML parsing without dependencies
        const allItems = [];
        const itemRegex = /<item>([\s\S]*?)<\/item>/g;
        let match;
        while ((match = itemRegex.exec(xml)) !== null && allItems.length < 15) {
            const block = match[1];
            const title = (block.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '';
            const link = (block.match(/<link>([\s\S]*?)<\/link>/) || [])[1] || '';
            const pubDate = (block.match(/<pubDate>([\s\S]*?)<\/pubDate>/) || [])[1] || '';
            const source = (block.match(/<source[^>]*>([\s\S]*?)<\/source>/) || [])[1] || '';

            // Clean CDATA
            const cleanTitle = title.replace(/<!\[CDATA\[|\]\]>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').trim();
            const cleanSource = source.replace(/<!\[CDATA\[|\]\]>/g, '').trim();

            if (cleanTitle) {
                allItems.push({
                    title: cleanTitle,
                    link: link.trim(),
                    source: cleanSource,
                    pubDate: pubDate.trim(),
                    timeAgo: getTimeAgo(pubDate.trim())
                });
            }
        }

        // Filter: only items from today
        const today = new Date();
        const todayStr = today.toISOString().slice(0, 10); // YYYY-MM-DD
        const items = allItems.filter(item => {
            if (!item.pubDate) return false;
            try {
                const d = new Date(item.pubDate);
                return d.toISOString().slice(0, 10) === todayStr;
            } catch { return false; }
        }).slice(0, 10);

        newsCache = { city, items, fetchedAt: Date.now() };
        res.json({ items, cached: false });
    } catch (e) {
        console.error('[News] Error fetching news:', e.message);
        // Return cache even if stale
        if (newsCache.items.length > 0) {
            return res.json({ items: newsCache.items, cached: true, stale: true });
        }
        res.status(500).json({ error: 'Erro ao buscar notícias', items: [] });
    }
});

function getTimeAgo(dateStr) {
    if (!dateStr) return '';
    try {
        const d = new Date(dateStr);
        const now = new Date();
        const diffMs = now - d;
        const mins = Math.floor(diffMs / 60000);
        if (mins < 1) return 'agora';
        if (mins < 60) return `${mins}min`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h`;
        return `${Math.floor(hrs / 24)}d`;
    } catch { return ''; }
}

export default router;
