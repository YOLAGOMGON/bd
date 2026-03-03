import { Router } from "express";
import {
  customerHistory,
  supplierAnalysis,
  topProductsByCategory
} from "../controllers/report.controller.js";

export const reportRoutes = Router();

reportRoutes.get("/suppliers", supplierAnalysis);
reportRoutes.get("/customers/:email", customerHistory);
reportRoutes.get("/categories/top-products", topProductsByCategory);
