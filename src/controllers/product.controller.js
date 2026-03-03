import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct
} from "../services/product.service.js";
import { AuditLog } from "../models/auditLog.model.js";
import { HttpError } from "../Errors/HttpError.js";

const requireFields = (body) => {
  const required = ["sku", "name", "unit_price", "category_id", "supplier_id"];
  const missing = required.filter((key) => body[key] === undefined);
  if (missing.length > 0) {
    throw new HttpError(400, `Missing fields: ${missing.join(", ")}`);
  }
};

const handleError = (res, error) => {
  const status = error.statusCode || 500;
  res.status(status).json({ error: error.message || "Server error" });
};

export const listProducts = async (req, res) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    handleError(res, error);
  }
};

export const getProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const product = await getProductById(id);
    res.json(product);
  } catch (error) {
    handleError(res, error);
  }
};

export const createProductHandler = async (req, res) => {
  try {
    requireFields(req.body);
    const product = await createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    handleError(res, error);
  }
};

export const updateProductHandler = async (req, res) => {
  try {
    const id = Number(req.params.id);
    requireFields(req.body);
    const product = await updateProduct(id, req.body);
    res.json(product);
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteProductHandler = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const deleted = await deleteProduct(id);

    await AuditLog.create({
      entity: "products",
      action: "DELETE",
      data: deleted
    });

    res.json({ message: "Product deleted", deleted });
  } catch (error) {
    handleError(res, error);
  }
};
