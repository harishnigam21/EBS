import express from "express";
import eventRoutes from "./routes/event";
import bookingRoutes from "./routes/booking";

const app = express();

app.use(express.json());
app.use("/api/event", eventRoutes);
app.use("/api/booking", bookingRoutes);

export default app;