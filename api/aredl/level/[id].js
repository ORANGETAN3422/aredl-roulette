export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.status(204).end();
        return;
    }

    const { id } = req.query;

    try {
        const response = await fetch(`https://api.aredl.net/v2/levels/${id}`);
        const data = await response.json();

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: 'Fetch failed' });
    }
}