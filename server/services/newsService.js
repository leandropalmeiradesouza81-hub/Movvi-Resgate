// In-memory cache
let newsCache = { city: '', items: [], fetchedAt: 0 };
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export async function getTrafficNews(city = 'Rio de Janeiro') {
    // Serve cache if fresh
    if (newsCache.city === city && Date.now() - newsCache.fetchedAt < CACHE_TTL) {
        return newsCache.items;
    }

    try {
        const query = encodeURIComponent(`${city} trânsito "G1" OR "R7" OR "O Globo" when:1d`);
        const rssUrl = `https://news.google.com/rss/search?q=${query}&hl=pt-BR&gl=BR&ceid=BR:pt-419`;

        const resp = await fetch(rssUrl, {
            headers: { 'User-Agent': 'MovviResgate/1.0' }
        });

        if (!resp.ok) throw new Error(`RSS fetch failed: ${resp.status}`);
        const xml = await resp.text();

        const allItems = [];
        const itemRegex = /<item>([\s\S]*?)<\/item>/g;
        let match;
        while ((match = itemRegex.exec(xml)) !== null && allItems.length < 30) {
            const block = match[1];
            const title = (block.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '';
            const link = (block.match(/<link>([\s\S]*?)<\/link>/) || [])[1] || '';
            const pubDate = (block.match(/<pubDate>([\s\S]*?)<\/pubDate>/) || [])[1] || '';
            const source = (block.match(/<source[^>]*>([\s\S]*?)<\/source>/) || [])[1] || '';
            const description = (block.match(/<description>([\s\S]*?)<\/description>/) || [])[1] || '';

            const cleanTitle = title.replace(/<!\[CDATA\[|\]\]>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').trim();
            const cleanSource = source.replace(/<!\[CDATA\[|\]\]>/g, '').trim();
            
            // Try to extract image from description
            let image = '';
            const imgMatch = description.match(/src="([^"]+)"/);
            if (imgMatch) {
                image = imgMatch[1];
            } else {
                // Default placeholder image for the location if not found
                image = `https://images.unsplash.com/photo-1544620347-c4fd4a3d5947?w=500&q=80`; // Generic car/road image
            }

            if (cleanTitle) {
                allItems.push({
                    title: cleanTitle,
                    link: link.trim(),
                    source: cleanSource,
                    image,
                    pubDate: pubDate.trim(),
                    timeAgo: getTimeAgo(pubDate.trim())
                });
            }
        }

        const items = allItems.slice(0, 20);
        newsCache = { city, items, fetchedAt: Date.now() };
        return items;
    } catch (e) {
        console.error('[NewsService] Error:', e.message);
        return newsCache.items || [];
    }
}

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
