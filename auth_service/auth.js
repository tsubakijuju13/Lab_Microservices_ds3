const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');

const app = express();
const port = 3000;

// Conexión a Redis
const client = redis.createClient({
    host: 'redis',
    port: 6379
});

client.on('error', (err) => {
    console.error('Error conectando a Redis:', err);
});

// Middleware para parsear el cuerpo de las solicitudes
app.use(bodyParser.json());

// Ruta para verificar si un token es válido
app.post('/verify-token', (req, res) => {
    const token = req.body.token;
    console.log("Entrando al auth")
    console.log(token)

    if (!token) {
        return res.status(400).json({ error: 'Token no proporcionado.' });
    }

    client.get(token, (err, result) => {
        if (err) {
            console.error('Error al recuperar el token:', err);
            return res.status(500).json({ error: 'Error interno del servidor.' });
        }

        if (result === 'valid') {

            res.status(200).json({ isValid: true });
        } else {

            res.status(200).json({ isValid: false });
        }
    });
});

// Inicializa el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

// Población inicial de tokens
const validTokens = [
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTEiLCJuYW1lIjoiQWxpY2UiLCJpYXQiOjE2MDIwMDAwMDB9.HaMtsRnsp4VvstGhJKymF_PnU1OUKkQBjYV6NajouIM",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTIiLCJuYW1lIjoiQm9iIiwiaWF0IjoxNjAyMDAwMDAwfQ.aIYwb2EdEZFpI6yZKrqT7J4BvGf4v34zXOZ4Q3eAfa4",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTMiLCJuYW1lIjoiQ2hhcmxpZSIsImlhdCI6MTYwMjAwMDAwMH0.1eX8y7t9I7uNAR2RTvmVNiZz-6T9ar4Bwh_vJZYmNOM",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTQiLCJuYW1lIjoiRGFuYSIsImlhdCI6MTYwMjAwMDAwMH0.KOAz5z8l_J8gB4rWkIpb6nArKsFfGgM59H-QTYJqB_4",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTUiLCJuYW1lIjoiRWRnYXIiLCJpYXQiOjE2MDIwMDAwMDB9.rFtw4nGnq7-0o1OhpPCsw5MlN-Rr9m-nn29f3ROG4Kk"
  ];
  

client.on('connect', () => {
    validTokens.forEach(token => {
        client.set(token, "valid", 'EX', 86400); //86400 segundos es igual a 24 horas (60 segundos por minuto × 60 minutos por hora × 24 horas = 86400 segundos).
    });
    console.log('Tokens almacenados en Redis');
});