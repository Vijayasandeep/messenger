import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cors from "cors";




dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));



app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.listen(5001, () => {
    console.log('Server is running on port 5001');
    console.log(`http://localhost:${port}`);
    connectDB();
});