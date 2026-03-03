import { pool } from "../config/database/pgconfig.js";
import { HttpError } from "../Errors/HttpError.js";

export const getAllProducts = async () => {
  const { rows } = await pool.query(
    `SELECT p.id, p.sku, p.name, p.unit_price, p.category_id, p.supplier_id
     FROM products p
     ORDER BY p.id`
  );
  return rows;
};

export const getProductById = async (id) => {
  const { rows } = await pool.query(
    `SELECT p.id, p.sku, p.name, p.unit_price, p.category_id, p.supplier_id
     FROM products p
     WHERE p.id = $1`,
    [id]
  );

  if (rows.length === 0) {
    throw new HttpError(404, "Product not found");
  }

  return rows[0];
};

export const createProduct = async (payload) => {
  const { sku, name, unit_price, category_id, supplier_id } = payload;
  const { rows } = await pool.query(
    `INSERT INTO products (sku, name, unit_price, category_id, supplier_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, sku, name, unit_price, category_id, supplier_id`,
    [sku, name, unit_price, category_id, supplier_id]
  );
  return rows[0];
};

export const updateProduct = async (id, payload) => {
  const { sku, name, unit_price, category_id, supplier_id } = payload;
  const { rows } = await pool.query(
    `UPDATE products
     SET sku = $1,
         name = $2,
         unit_price = $3,
         category_id = $4,
         supplier_id = $5
     WHERE id = $6
     RETURNING id, sku, name, unit_price, category_id, supplier_id`,
    [sku, name, unit_price, category_id, supplier_id, id]
  );

  if (rows.length === 0) {
    throw new HttpError(404, "Product not found");
  }

  return rows[0];
};

export const deleteProduct = async (id) => {
  const { rows } = await pool.query(
    `DELETE FROM products
     WHERE id = $1
     RETURNING id, sku, name, unit_price, category_id, supplier_id`,
    [id]
  );

  if (rows.length === 0) {
    throw new HttpError(404, "Product not found");
  }

  return rows[0];
};
