import express from "express";
import eventRoutes from "./routes/event";
import bookingRoutes from "./routes/booking";
import authRoutes from "./routes/auth";

const app = express();

app.use(express.json());
app.use("/api/event", eventRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/auth", authRoutes);

export default app;