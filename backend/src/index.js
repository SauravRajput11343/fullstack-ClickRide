import express from "express";
import authRoutes from "./routes/auth.routes.js";
import vehicleRoutes from "./routes/vehicle.routes.js"
import cookieParser from "cookie-parser";
import cors from "cors"
import { connectDB } from "./lib/db.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

const PORT = process.env.PORT

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}
));
// Use the authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/vehicle", vehicleRoutes);

// Start the server
app.listen(PORT, () => {
    console.log("Server is running on port: " + PORT);
    connectDB(); // Ensure the database is connected
});
