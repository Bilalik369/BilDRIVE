import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js"; 
import { createServer } from "http"
import authRoutes from "./routes/auth.routes.js"
import { initializeSocket } from "./utils/realtime.utils.js"
dotenv.config();

const app = express();
const server = createServer(app);

initializeSocket(server);

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);

const startServer = async () => {
  try {
    await connectDB();  
    server.listen(PORT, () => {
      console.log(`Serveur lancé sur le port ${PORT}`);
    });
  } catch (error) {
    console.error("Erreur lors de la connexion à la base de données :", error);
    process.exit(1);  
  }
};

startServer();
