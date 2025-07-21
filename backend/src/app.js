import express from "express";
import { createServer } from "node:http";
import dotenv from "dotenv";
dotenv.config();

import { Server } from "socket.io";
import mongoose from "mongoose";
import { connectToSocket } from "./controllers/socketManager.js";

import cors from "cors";
import userRoutes from "./routes/users.routes.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", process.env.PORT || 8000);

app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/users", userRoutes);

const start = async () => {
    try {
        // ✅ Modern MongoDB connection (no deprecated options)
        const connectionDb = await mongoose.connect(process.env.MONGO_URL);

        console.log(`✅ MONGO Connected: ${connectionDb.connection.host}`);

        server.listen(app.get("port"), () => {
            console.log(`✅ Server running on PORT ${app.get("port")}`);
        });
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err.message);
        process.exit(1);
    }
};

start();
