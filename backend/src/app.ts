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
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";
swaggerDocument.servers = [
  {
    url: process.env.BACKEND_HOST,
    description: "Dynamic server",
  },
];
app.use(express.json());
app.get("/", (req, res) => {
  res.send(
    "Event Booking System API is running! Go to /api-docs for documentation.",
  );
});
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customCssUrl: CSS_URL,
    customJs: [
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui-bundle.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui-standalone-preset.min.js",
    ],
  }),
);
app.use("/", adminRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/auth", authRoutes);

export default app;
