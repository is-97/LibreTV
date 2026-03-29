// functions/image-proxy.js
// 豆瓣封面图防盗链代理，无需鉴权

export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    const imageUrl = url.searchParams.get('url');

    if (!imageUrl) {
        return new Response(JSON.stringify({ error: 'Missing image URL' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const imageResponse = await fetch(imageUrl, {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                Accept: 'image/jpeg,image/png,image/gif,*/*;q=0.8',
                Referer: 'https://movie.douban.com/',
            },
        });

        if (!imageResponse.ok) {
            return new Response(JSON.stringify({ error: imageResponse.statusText }), {
                status: imageResponse.status,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const contentType = imageResponse.headers.get('content-type');
        if (!imageResponse.body) {
            return new Response(JSON.stringify({ error: 'No body' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const headers = new Headers();
        if (contentType) headers.set('Content-Type', contentType);
        headers.set('Cache-Control', 'public, max-age=15720000, s-maxage=15720000');
        headers.set('Access-Control-Allow-Origin', '*');

        return new Response(imageResponse.body, { status: 200, headers });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Error fetching image' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
