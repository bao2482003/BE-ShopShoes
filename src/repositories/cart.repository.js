const pool = require("../config/db");

const getProductById = async (productId) => {
  const [rows] = await pool.query("SELECT id, name, price, stock, image_url FROM products WHERE id = ? LIMIT 1", [productId]);
  return rows[0] || null;
};

const getOrCreateDefaultVariantByProductId = async (productId) => {
  const [rows] = await pool.query(
    "SELECT id FROM product_variants WHERE product_id = ? ORDER BY id ASC LIMIT 1",
    [productId]
  );

  if (rows[0]) {
    return rows[0].id;
  }

  const sku = `P${productId}-DEFAULT`;
  const [result] = await pool.query(
    "INSERT INTO product_variants (product_id, sku, size, color, stock) VALUES (?, ?, 'Default', 'Default', 9999)",
    [productId, sku]
  );

  return result.insertId;
};

const getCartByUserId = async (userId) => {
  const [rows] = await pool.query("SELECT * FROM carts WHERE user_id = ? LIMIT 1", [userId]);
  return rows[0] || null;
};

const createCart = async (userId) => {
  const [result] = await pool.query("INSERT INTO carts (user_id) VALUES (?)", [userId]);
  const [rows] = await pool.query("SELECT * FROM carts WHERE id = ? LIMIT 1", [result.insertId]);
  return rows[0] || null;
};

const getOrCreateCartByUserId = async (userId) => {
  const existing = await getCartByUserId(userId);
  if (existing) {
    return existing;
  }
  return createCart(userId);
};

const getCartItemByCartAndVariant = async (cartId, variantId) => {
  const [rows] = await pool.query(
    "SELECT * FROM cart_items WHERE cart_id = ? AND variant_id = ? LIMIT 1",
    [cartId, variantId]
  );
  return rows[0] || null;
};

const createCartItem = async ({ cartId, variantId, quantity }) => {
  const [result] = await pool.query(
    "INSERT INTO cart_items (cart_id, variant_id, quantity) VALUES (?, ?, ?)",
    [cartId, variantId, quantity]
  );
  const [rows] = await pool.query("SELECT * FROM cart_items WHERE id = ? LIMIT 1", [result.insertId]);
  return rows[0] || null;
};

const updateCartItemQuantity = async (id, quantity) => {
  await pool.query(
    "UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    [quantity, id]
  );
  const [rows] = await pool.query("SELECT * FROM cart_items WHERE id = ? LIMIT 1", [id]);
  return rows[0] || null;
};

const getCartItemsByCartId = async (cartId) => {
  const [rows] = await pool.query(
    `
    SELECT
      ci.id,
      ci.cart_id,
      ci.variant_id,
      ci.quantity,
      ci.created_at,
      ci.updated_at,
      p.id AS product_id,
      p.name AS product_name,
      p.price AS product_price,
      p.image_url AS product_image_url,
      pv.size AS variant_size,
      pv.color AS variant_color
    FROM cart_items ci
    JOIN product_variants pv ON pv.id = ci.variant_id
    JOIN products p ON p.id = pv.product_id
    WHERE ci.cart_id = ?
    ORDER BY ci.created_at DESC
    `,
    [cartId]
  );

  return rows;
};

const getCartItemByIdAndCartId = async (itemId, cartId) => {
  const [rows] = await pool.query(
    `
    SELECT
      ci.id,
      ci.cart_id,
      ci.variant_id,
      ci.quantity,
      p.id AS product_id,
      p.stock AS product_stock
    FROM cart_items ci
    JOIN product_variants pv ON pv.id = ci.variant_id
    JOIN products p ON p.id = pv.product_id
    WHERE ci.id = ? AND ci.cart_id = ?
    LIMIT 1
    `,
    [itemId, cartId]
  );

  return rows[0] || null;
};

const deleteCartItemById = async (itemId) => {
  const [result] = await pool.query("DELETE FROM cart_items WHERE id = ?", [itemId]);
  return result.affectedRows > 0;
};

module.exports = {
  getProductById,
  getOrCreateDefaultVariantByProductId,
  getOrCreateCartByUserId,
  getCartItemByCartAndVariant,
  createCartItem,
  updateCartItemQuantity,
  getCartItemsByCartId,
  getCartItemByIdAndCartId,
  deleteCartItemById
};
