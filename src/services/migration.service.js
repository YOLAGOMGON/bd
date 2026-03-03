import fs from "fs/promises";
import path from "path";
import { parse } from "csv-parse/sync";
import { pool } from "../config/database/pgconfig.js";

export const loadCsvData = async (filePath) => {
  const csvPath =
    filePath || path.join(process.cwd(), "docs", "data.csv");

  const content = await fs.readFile(csvPath, "utf-8");
  const records = parse(content, {
    columns: true,
    delimiter: ";",
    trim: true,
    skip_empty_lines: true
  });

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const row of records) {
      const customerResult = await client.query(
        `INSERT INTO customers (name, email, address, phone)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (email) DO UPDATE
         SET name = EXCLUDED.name,
             address = EXCLUDED.address,
             phone = EXCLUDED.phone
         RETURNING id`,
        [
          row.customer_name,
          row.customer_email,
          row.customer_address,
          row.customer_phone
        ]
      );
      const customerId = customerResult.rows[0].id;

      const supplierResult = await client.query(
        `INSERT INTO suppliers (name, email)
         VALUES ($1, $2)
         ON CONFLICT (email) DO UPDATE
         SET name = EXCLUDED.name
         RETURNING id`,
        [row.supplier_name, row.supplier_email]
      );
      const supplierId = supplierResult.rows[0].id;

      const categoryResult = await client.query(
        `INSERT INTO categories (name)
         VALUES ($1)
         ON CONFLICT (name) DO UPDATE
         SET name = EXCLUDED.name
         RETURNING id`,
        [row.product_category]
      );
      const categoryId = categoryResult.rows[0].id;

      const productResult = await client.query(
        `INSERT INTO products (sku, name, unit_price, category_id, supplier_id)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (sku) DO UPDATE
         SET name = EXCLUDED.name,
             unit_price = EXCLUDED.unit_price,
             category_id = EXCLUDED.category_id,
             supplier_id = EXCLUDED.supplier_id
         RETURNING id`,
        [
          row.product_sku,
          row.product_name,
          Number(row.unit_price),
          categoryId,
          supplierId
        ]
      );
      const productId = productResult.rows[0].id;

      const orderResult = await client.query(
        `INSERT INTO orders (transaction_id, order_date, customer_id)
         VALUES ($1, $2, $3)
         ON CONFLICT (transaction_id) DO UPDATE
         SET order_date = EXCLUDED.order_date,
             customer_id = EXCLUDED.customer_id
         RETURNING id`,
        [row.transaction_id, row.date, customerId]
      );
      const orderId = orderResult.rows[0].id;

      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_line_value)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (order_id, product_id) DO UPDATE
         SET quantity = EXCLUDED.quantity,
             unit_price = EXCLUDED.unit_price,
             total_line_value = EXCLUDED.total_line_value`,
        [
          orderId,
          productId,
          Number(row.quantity),
          Number(row.unit_price),
          Number(row.total_line_value)
        ]
      );
    }

    await client.query("COMMIT");
    return { rowsProcessed: records.length };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
