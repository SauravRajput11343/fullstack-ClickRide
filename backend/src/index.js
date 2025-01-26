import express from "express";
import authRoutes from "./routes/auth.routes.js";
import vehicleRoutes from "./routes/vehicle.routes.js"
import partnerRoutes from "./routes/partner.routes.js"
import cookieParser from "cookie-parser";
import cors from "cors"
import { connectDB } from "./lib/db.js";
import dotenv from "dotenv";
import path from "path"
dotenv.config();

const app = express();

const PORT = process.env.PORT
const __dirname = path.resolve();
// Middleware to parse JSON bodies
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}
));
// Use the authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/vehicle", vehicleRoutes);
app.use("/api/partner", partnerRoutes);
// Start the server

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

app.listen(PORT, () => {
    console.log("Server is running on port: " + PORT);
    connectDB(); // Ensure the database is connected
});
