import { pool } from "../config/database/pgconfig.js";
import { HttpError } from "../Errors/HttpError.js";

export const getSupplierAnalysis = async () => {
  const { rows } = await pool.query(
    `SELECT s.id,
            s.name,
            s.email,
            SUM(oi.quantity) AS total_items,
            SUM(oi.total_line_value) AS total_value
     FROM suppliers s
     JOIN products p ON p.supplier_id = s.id
     JOIN order_items oi ON oi.product_id = p.id
     GROUP BY s.id, s.name, s.email
     ORDER BY total_items DESC`
  );
  return rows;
};

export const getCustomerHistory = async (email) => {
  const customerResult = await pool.query(
    `SELECT id, name, email
     FROM customers
     WHERE email = $1`,
    [email]
  );

  if (customerResult.rows.length === 0) {
    throw new HttpError(404, "Customer not found");
  }

  const customer = customerResult.rows[0];

  const { rows } = await pool.query(
    `SELECT o.transaction_id,
            o.order_date,
            p.name AS product_name,
            p.sku AS product_sku,
            oi.quantity,
            oi.unit_price,
            oi.total_line_value
     FROM orders o
     JOIN order_items oi ON oi.order_id = o.id
     JOIN products p ON p.id = oi.product_id
     WHERE o.customer_id = $1
     ORDER BY o.order_date, o.transaction_id`,
    [customer.id]
  );

  return { customer, purchases: rows };
};

export const getTopProductsByCategory = async (category) => {
  const { rows } = await pool.query(
    `SELECT c.name AS category,
            p.id,
            p.sku,
            p.name,
            SUM(oi.quantity) AS total_quantity,
            SUM(oi.total_line_value) AS total_revenue
     FROM categories c
     JOIN products p ON p.category_id = c.id
     JOIN order_items oi ON oi.product_id = p.id
     WHERE c.name = $1
     GROUP BY c.name, p.id, p.sku, p.name
     ORDER BY total_revenue DESC`,
    [category]
  );
  return rows;
};
