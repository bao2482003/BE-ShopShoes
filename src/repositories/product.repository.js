const pool = require("../config/db");

const getAllProducts = async () => {
  const [rows] = await pool.query("SELECT * FROM products ORDER BY created_at DESC");
  return rows;
};

const getProductById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM products WHERE id = ? LIMIT 1", [id]);
  return rows[0] || null;
};

const createProduct = async ({ name, brand, price, stock, description, imageUrl }) => {
  const [result] = await pool.query(
    "INSERT INTO products (name, brand, price, stock, description, image_url) VALUES (?, ?, ?, ?, ?, ?)",
    [name, brand, price, stock, description, imageUrl]
  );
  return getProductById(result.insertId);
};

const updateProduct = async (id, payload) => {
  const fields = [];
  const values = [];

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  });

  if (fields.length === 0) {
    return getProductById(id);
  }

  values.push(id);

  await pool.query(
    `UPDATE products SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    values
  );

  return getProductById(id);
};

const deleteProduct = async (id) => {
  const [result] = await pool.query("DELETE FROM products WHERE id = ?", [id]);
  return result.affectedRows > 0;
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
