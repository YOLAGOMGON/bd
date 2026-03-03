import { Router } from "express";
import {
  createProductHandler,
  deleteProductHandler,
  getProduct,
  listProducts,
  updateProductHandler
} from "../controllers/product.controller.js";

export const productRoutes = Router();

productRoutes.get("/", listProducts);
productRoutes.get("/:id", getProduct);
productRoutes.post("/", createProductHandler);
productRoutes.put("/:id", updateProductHandler);
productRoutes.delete("/:id", deleteProductHandler);
