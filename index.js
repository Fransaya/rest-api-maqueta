import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import http from "http";
import axios from "axios";
import webhookRouter from "./webhook.js";

// Funciones de jwt y validaciones
import verifyAccessToken from "./middlewares/verifyAccessToken.js";
import validateToken from "./utils/auth/verifyToken.js";
import refreshAccessToken from "./utils/auth/refreshToken.js";
import generateToken from "./utils/auth/generateToken.js";

// OpenAI SDK
import OpenAI from "openai";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("dev"));

//* GET SIMPLE : devuelve un mensaje de estado
app.get("/", (req, res) => {
  res.status(200).json({ message: "API activa!" });
});

//* GET DATA : obtiene datos de una API externa y los devuelve
app.get("/data", async (req, res) => {
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/posts/1"
  );
  res.status(200).json(response.data);
});

//* POST DATA : recibe datos en el cuerpo de la solicitud y los devuelve
app.post("/data", (req, res) => {
  const receivedData = req.body;
  res.status(200).json({ message: "Datos recibidos", data: receivedData });
});

//* PUT DATA : actualiza datos basados en un ID proporcionado en la URL
app.put("/data/:id", (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  res
    .status(200)
    .json({ message: `Datos con ID ${id} actualizados`, data: updatedData });
});

//* WEBHOOK
app.use("/webhook", webhookRouter);

//* METODOS DE JWT
app.post("/generate-token", async (req, res) => {
  const user = req.body;

  try {
    const token = generateToken(user, process.env.JWT_SECRET, "1h");
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Error al generar el token" });
  }
});

app.post("/generate-refresh-token", async (req, res) => {
  const user = req.body;

  try {
    const refreshToken = generateToken(
      user,
      process.env.REFRESH_TOKEN_SECRET,
      "7d"
    );
    res.status(200).json({ refreshToken });
  } catch (error) {
    res.status(500).json({ error: "Error al generar el refresh token" });
  }
});

app.post("/validate-token", async (req, res) => {
  const { accessToken } = req.body;

  try {
    const user = await validateToken(accessToken);
    res.status(200).json({ message: "Token válido", user });
  } catch (error) {
    res.status(401).json({ error: "Token inválido", response: error });
  }
});

app.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;

  try {
    const newAccessToken = await refreshAccessToken(refreshToken);
    res.status(200).json({ message: "Token refrescado", newAccessToken });
  } catch (error) {
    res.status(401).json({ error: "Error al refrescar el token" });
  }
});

app.get("/protected", verifyAccessToken, (req, res) => {
  try {
    res
      .status(200)
      .json({ message: "Acceso concedido a ruta protegida", user: req.user });
  } catch (error) {
    res.status(500).json({ error: "Error al acceder a la ruta protegida" });
  }
});

//* METODO DE REQUEST A OPEN AI

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30000,
  maxRetries: 2,
});

app.post("/openai", async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await openai.responses.create({
      model: "gpt4o-mini",
      input: prompt,
      max_output_tokens: 500,
    });

    res.status(200).json({ response });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al comunicarse con OpenAI", details: error });
  }
});

//* INSTANCIA DEL SERVIDOR
const server = http.createServer(app);

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
