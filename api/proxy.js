
import fetch from 'node-fetch';

export default async function handler(req, res) {
    const { path } = req.query;
    const url = `https://api.holded.com/api/${path}`;

    try {
        const response = await fetch(url, {
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer 41c0fff04435e0638a6406d64376d702`, // Cambia `YOUR_API_KEY` por la clave de API correcta
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error en la respuesta de Holded: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Configuración de CORS
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        // Responder con los datos de la API
        res.status(response.status).json(data);
    } catch (error) {
        console.error('Error al obtener datos de la API de Holded:', error);
        res.status(500).json({ error: 'Error al obtener datos de la API de Holded', details: error.message });
    }
}

