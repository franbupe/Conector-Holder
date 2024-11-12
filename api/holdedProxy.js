import fetch from 'node-fetch';

export default async function handler(req, res) {
    const { path } = req.query;
    const url = `https://api.holded.com/api/${path}`;

    try {
        const response = await fetch(url, {
            method: req.method,
            headers: {
                accept: 'application/json',
                key: '41c0fff04435e0638a6406d64376d702', // Coloca aquí tu API Key de Holded
            }
        });

        // Pasar la respuesta directamente al cliente
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error('Error al obtener datos de la API de Holded:', error);
        res.status(500).json({ error: 'Error al obtener datos de la API de Holded' });
    }
}
