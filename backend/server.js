import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js"; 
import cors from 'cors' 
import { createServer } from "http"
import authRoutes from "./routes/auth.routes.js"
import rideRoutes from "./routes/ride.routes.js"
import { initializeSocket } from "./utils/realtime.utils.js"
dotenv.config();

const app = express();
const server = createServer(app);

initializeSocket(server);
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"  , "http://localhost:3001","http://127.0.0.1:3001" ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);
app.use("/api/rides", rideRoutes)

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