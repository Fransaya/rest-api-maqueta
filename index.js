import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import http from 'http';
import axios from 'axios';
import webhookRouter from './webhook.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));

//* GET SIMPLE : devuelve un mensaje de estado
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API activa!' });
});

//* GET DATA : obtiene datos de una API externa y los devuelve
app.get('/data', async (req, res) => {
  const response = await axios.get(
    'https://jsonplaceholder.typicode.com/posts/1'
  );
  res.status(200).json(response.data);
});

//* POST DATA : recibe datos en el cuerpo de la solicitud y los devuelve
app.post('/data', (req, res) => {
  const receivedData = req.body;
  res.status(200).json({ message: 'Datos recibidos', data: receivedData });
});

//* PUT DATA : actualiza datos basados en un ID proporcionado en la URL
app.put('/data/:id', (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  res
    .status(200)
    .json({ message: `Datos con ID ${id} actualizados`, data: updatedData });
});

//* WEBHOOK
app.use('/webhook', webhookRouter);

//* INSTANCIA DEL SERVIDOR
const server = http.createServer(app);

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
