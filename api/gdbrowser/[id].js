export default async function handler(req, res) {
    const id = req.query;

    try {
        const response = await fetch(`https://gdbrowser.com/api/level/${id}`);
        if (!response.ok) {
            return res.status(response.status).json({ error: "Failed to fetch data" });
        }
        const data = await response.json();

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET");
        res.setHeader("Content-Type", "application/json");

        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({ error: "Server error", details: err.message });
    }
}