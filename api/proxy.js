
import fetch from 'node-fetch';

export default async function handler(req, res) {
    const { path } = req.query;
    const url = `https://api.holded.com/api/${path}`;

    try {
        const response = await fetch(url, {
            method: req.method,
            headers: {
                accept: 'application/json',
                key: '41c0fff04435e0638a6406d64376d702' // Reemplaza con tu API Key de Holded
            }
        });

        if (!response.ok) {
            throw new Error(`Error en la respuesta de Holded: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Configuración de CORS
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, key');

        // Responder con los datos de la API
        res.status(response.status).json(data);
    } catch (error) {
        console.error('Error al obtener datos de la API de Holded:', error);
        res.status(500).json({ error: 'Error al obtener datos de la API de Holded', details: error.message });
    }
}

