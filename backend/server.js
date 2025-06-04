import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js"; 

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(` Serveur lancé sur le port ${PORT}`);
});
