import express from "express";
import eventRoutes from "./routes/event";
import bookingRoutes from "./routes/booking";
import authRoutes from "./routes/auth";
import adminRoutes from "./routes/admin";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

const app = express();
const swaggerDocument = YAML.load(path.join(__dirname, "../swagger.yaml"));
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/", adminRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/auth", authRoutes);

export default app;
