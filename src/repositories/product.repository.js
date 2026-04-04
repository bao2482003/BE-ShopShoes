const pool = require("../config/db");

const PRODUCT_SELECT = `
  SELECT
    p.*,
    b.name AS brand,
    c.name AS category
  FROM products p
  JOIN brands b ON b.id = p.brand_id
  JOIN categories c ON c.id = p.category_id
`;

const getOrCreateBrandId = async (brandName) => {
  const normalized = String(brandName || "").trim();
  const [rows] = await pool.query("SELECT id FROM brands WHERE name = ? LIMIT 1", [normalized]);
  if (rows[0]) {
    return rows[0].id;
  }

  const [result] = await pool.query("INSERT INTO brands (name) VALUES (?)", [normalized]);
  return result.insertId;
};

const getOrCreateCategoryId = async (categoryName) => {
  const normalized = String(categoryName || "General").trim() || "General";
  const [rows] = await pool.query("SELECT id FROM categories WHERE name = ? LIMIT 1", [normalized]);
  if (rows[0]) {
    return rows[0].id;
  }

  const [result] = await pool.query("INSERT INTO categories (name) VALUES (?)", [normalized]);
  return result.insertId;
};

const getAllProducts = async () => {
  const [rows] = await pool.query(`${PRODUCT_SELECT} ORDER BY p.created_at DESC`);
  return rows;
};

const getProductById = async (id) => {
  const [rows] = await pool.query(`${PRODUCT_SELECT} WHERE p.id = ? LIMIT 1`, [id]);
  return rows[0] || null;
};

const createProduct = async ({ name, brand, category, price, stock, description, imageUrl }) => {
  const brandId = await getOrCreateBrandId(brand);
  const categoryId = await getOrCreateCategoryId(category);

  const [result] = await pool.query(
    "INSERT INTO products (name, brand_id, category_id, price, stock, description, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [name, brandId, categoryId, price, stock, description, imageUrl]
  );
  return getProductById(result.insertId);
};

const updateProduct = async (id, payload) => {
  const fields = [];
  const values = [];

  if (payload.brand !== undefined) {
    payload.brand_id = await getOrCreateBrandId(payload.brand);
    delete payload.brand;
  }

  if (payload.category !== undefined) {
    payload.category_id = await getOrCreateCategoryId(payload.category);
    delete payload.category;
  }

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
  deleteProduct,
  getOrCreateBrandId,
  getOrCreateCategoryId
};
