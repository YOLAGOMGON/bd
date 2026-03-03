import express from "express";
import { productRoutes } from "./routes/product.route.js";
import { migrationRoutes } from "./routes/migration.route.js";
import { reportRoutes } from "./routes/report.route.js";
import { connectMongo } from "./config/database/mongoconfig.js";
import { connectPostgres } from "./config/database/pgconfig.js";

connectMongo();
await connectPostgres();

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/products", productRoutes);
app.use("/migration", migrationRoutes);
app.use("/reports", reportRoutes);

export default app;
