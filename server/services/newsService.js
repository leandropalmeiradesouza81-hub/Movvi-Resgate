// In-memory cache for multiple cities
const newsCache = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function getTrafficNews(city = 'Rio de Janeiro') {
    const cached = newsCache.get(city);
    if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
        return cached.items;
    }

    try {
        // Force regional context to avoid results from other states (like SP or Recife)
        const regionalContext = city.toLowerCase().includes('rio') || city.toLowerCase().includes('rj') ? '' : ' Rio de Janeiro RJ';
        const query = encodeURIComponent(`${city}${regionalContext} trânsito notícias when:7d`);
        const rssUrl = `https://news.google.com/rss/search?q=${query}&hl=pt-BR&gl=BR&ceid=BR:pt-419`;

        const resp = await fetch(rssUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
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
                // Google News often uses small thumbnails, try to get a slightly better version if it's a known pattern
                if (image.includes('lh3.googleusercontent.com')) {
                    image = image.replace(/=w\d+-h\d+/, '=w800-h600');
                }
            } else {
                // Use a diverse set of traffic/city images based on title keywords to avoid repetition
                const keywords = ['traffic', 'street', 'city', 'car', 'ambulance', 'police', 'highway'];
                const randomSeed = Math.abs(cleanTitle.split('').reduce((a,b) => (a<<5)-a+b.charCodeAt(0), 0)) % keywords.length;
                image = `https://images.unsplash.com/photo-${[
                    '1544620347-c4fd4a3d5947', // car
                    '1514924013597-4b743088202c', // night city
                    '1449965408869-eaa3f722e40d', // driving
                    '1494976388531-d1058494cdd8', // dash
                    '1506015391300-4802dc74de2e', // highway
                    '1581005151525-41e97596ad5e'  // road signs
                ][randomSeed % 6]}?w=800&q=80`;
            }

            if (cleanTitle) {
                const slug = cleanTitle.toLowerCase()
                    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
                    .replace(/[^a-z0-9]/g, '-') // Replace non-alphanumeric with dash
                    .replace(/-+/g, '-') // Remove double dashes
                    .replace(/^-|-$/g, ''); // Trim dashes
                
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

        const items = allItems.slice(0, 20);
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
