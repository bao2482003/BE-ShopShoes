const pool = require("../config/db");

const findUserByEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
  return rows[0] || null;
};

const findUserById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE id = ? LIMIT 1", [id]);
  return rows[0] || null;
};

const createUser = async ({ fullName, email, passwordHash, role }) => {
  const [result] = await pool.query(
    "INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)",
    [fullName, email, passwordHash, role]
  );

  return findUserById(result.insertId);
};

const listUsers = async () => {
  const [rows] = await pool.query("SELECT * FROM users ORDER BY created_at DESC");
  return rows;
};

const updateUser = async (id, payload) => {
  const fields = [];
  const values = [];

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  });

  if (fields.length === 0) {
    return findUserById(id);
  }

  values.push(id);
  await pool.query(`UPDATE users SET ${fields.join(", ")} WHERE id = ?`, values);
  return findUserById(id);
};

const deleteUser = async (id) => {
  const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
  return result.affectedRows > 0;
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  listUsers,
  updateUser,
  deleteUser
};
