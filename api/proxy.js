import fetch from 'node-fetch';

export default async function handler(req, res) {
    const { path } = req.query;
    const url = `https://api.holded.com/api/${path}`;

    const response = await fetch(url, {
        method: req.method,
        headers: {
            ...req.headers,
            key: 'YOUR_API_KEY', // Coloca aquí tu API Key de Holded
            host: 'api.holded.com',
            'Access-Control-Allow-Origin': '*'
        }
    });

    const data = await response.json();
    res.status(response.status).json(data);
}
