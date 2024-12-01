// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import taskroutes from "./routes/taskroutes.js";
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(cors());
app.use(express.json());
// Routes
app.use("/api", taskroutes);
// Database Connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>{ app.listen(PORT, () => console.log(`Server Port:${PORT}`));})
  .catch(err => console.log(err));