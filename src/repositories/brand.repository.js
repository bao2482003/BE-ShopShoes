const pool = require("../config/db");

const listBrands = async () => {
  const [rows] = await pool.query("SELECT * FROM brands ORDER BY created_at DESC");
  return rows;
};

const getBrandById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM brands WHERE id = ? LIMIT 1", [id]);
  return rows[0] || null;
};

const findBrandByName = async (name) => {
  const [rows] = await pool.query("SELECT * FROM brands WHERE name = ? LIMIT 1", [name]);
  return rows[0] || null;
};

const createBrand = async (name) => {
  const [result] = await pool.query("INSERT INTO brands (name) VALUES (?)", [name]);
  return getBrandById(result.insertId);
};

const updateBrand = async (id, name) => {
  await pool.query("UPDATE brands SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [name, id]);
  return getBrandById(id);
};

const deleteBrand = async (id) => {
  const [result] = await pool.query("DELETE FROM brands WHERE id = ?", [id]);
  return result.affectedRows > 0;
};

module.exports = {
  listBrands,
  getBrandById,
  findBrandByName,
  createBrand,
  updateBrand,
  deleteBrand
};
