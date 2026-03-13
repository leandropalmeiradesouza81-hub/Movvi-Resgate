import axios from 'axios';

// In-memory cache for multiple cities and article images
const newsCache = new Map();
const imageCache = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

/**
 * Fetches the real og:image from the article URL if the RSS feed lacks it
 */
async function getRealArticleImage(url) {
    if (!url) return null;
    if (imageCache.has(url)) return imageCache.get(url);

    try {
        const response = await axios.get(url, {
            timeout: 3000,
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' },
            maxContentLength: 500000 // Don't download more than 500KB
        });

        const html = response.data;
        const ogImage = html.match(/<meta property="og:image" content="([^"]+)"/i) ||
                        html.match(/<meta name="twitter:image" content="([^"]+)"/i) ||
                        html.match(/<meta property="og:image:secure_url" content="([^"]+)"/i);

        if (ogImage && ogImage[1]) {
            const imgUrl = ogImage[1].replace(/&amp;/g, '&');
            imageCache.set(url, imgUrl);
            return imgUrl;
        }
    } catch (e) {
        // Silently fail and return null for fallback
    }
    return null;
}

export async function getTrafficNews(city = 'Rio de Janeiro') {
    const cached = newsCache.get(city);
    if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
        return cached.items;
    }

    try {
        // Strict regional search to avoid cross-state confusion
        const searchLocation = 'Rio de Janeiro RJ';
        const query = encodeURIComponent(`${city} "${searchLocation}" trânsito notícias`).replace(/%20/g, '+');
        const rssUrl = `https://news.google.com/rss/search?q=${query}&hl=pt-BR&gl=BR&ceid=BR:pt-419`;

        const resp = await fetch(rssUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
        });

        if (!resp.ok) throw new Error(`RSS fetch failed: ${resp.status}`);
        const xml = await resp.text();

        const allItems = [];
        const itemRegex = /<item>([\s\S]*?)<\/item>/g;
        let match;
        while ((match = itemRegex.exec(xml)) !== null && allItems.length < 20) {
            const block = match[1];
            const title = (block.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '';
            const link = (block.match(/<link>([\s\S]*?)<\/link>/) || [])[1] || '';
            const pubDate = (block.match(/<pubDate>([\s\S]*?)<\/pubDate>/) || [])[1] || '';
            const source = (block.match(/<source[^>]*>([\s\S]*?)<\/source>/) || [])[1] || '';
            const description = (block.match(/<description>([\s\S]*?)<\/description>/) || [])[1] || '';

            const cleanTitle = title.replace(/<!\[CDATA\[|\]\]>/g, '').split(' - ')[0].trim();
            const cleanSource = source.replace(/<!\[CDATA\[|\]\]>/g, '').trim();
            
            let image = '';
            const imgMatch = description.match(/src="([^"]+)"/);
            if (imgMatch) {
                image = imgMatch[1].replace(/&amp;/g, '&');
                if (image.includes('lh3.googleusercontent.com')) {
                    image = image.replace(/=w\d+-h\d+/, '=w1200-h800');
                }
            }

            if (cleanTitle) {
                const slug = cleanTitle.toLowerCase()
                    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                    .replace(/[^a-z0-9]/g, '-')
                    .replace(/-+/g, '-')
                    .replace(/^-|-$/g, '');
                
                allItems.push({
                    title: cleanTitle,
                    slug,
                    link: link.trim(),
                    source: cleanSource,
                    image,
                    pubDate: pubDate.trim(),
                    timeAgo: getTimeAgo(pubDate.trim())
                });
            }
        }

        // Parallel Meta-Scraping for missing images (Optimization: Limit to top 12)
        const items = allItems.slice(0, 12);
        await Promise.all(items.map(async (item) => {
            if (!item.image || item.image.includes('unsplash')) {
                const realImg = await getRealArticleImage(item.link);
                if (realImg) item.image = realImg;
            }
            
            // Final fallback if even scraping fails
            if (!item.image) {
                const imgIds = ['1544620347-c4fd4a3d5947', '1514924013597-4b743088202c', '1449965408869-eaa3f722e40d', '1494976388531-d1058494cdd8'];
                const seed = Math.abs(item.title.length) % imgIds.length;
                item.image = `https://images.unsplash.com/photo-${imgIds[seed]}?w=800&q=80`;
            }
        }));

        newsCache.set(city, { items, fetchedAt: Date.now() });
        return items;
    } catch (e) {
        console.error('[NewsService] Error:', e.message);
        const cached = newsCache.get(city);
        return cached ? cached.items : [];
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
