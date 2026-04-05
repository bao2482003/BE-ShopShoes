const pool = require("../config/db");

const getOrderById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM orders WHERE id = ? LIMIT 1", [id]);
  return rows[0] || null;
};

const ORDER_WITH_PAYMENT_SELECT = `
  SELECT
    o.*,
    p.id AS payment_id,
    p.method AS payment_method,
    p.status AS payment_status,
    p.amount AS payment_amount,
    p.transaction_ref AS payment_transaction_ref,
    p.paid_at AS payment_paid_at,
    p.created_at AS payment_created_at,
    p.updated_at AS payment_updated_at
  FROM orders o
  LEFT JOIN payments p ON p.order_id = o.id
`;

const getOrdersByUserId = async (userId) => {
  const [rows] = await pool.query(
    `${ORDER_WITH_PAYMENT_SELECT} WHERE o.user_id = ? ORDER BY o.created_at DESC`,
    [userId]
  );
  return rows;
};

const getOrderByIdAndUserId = async (id, userId) => {
  const [rows] = await pool.query(
    `${ORDER_WITH_PAYMENT_SELECT} WHERE o.id = ? AND o.user_id = ? LIMIT 1`,
    [id, userId]
  );
  return rows[0] || null;
};

const getOrdersForDelivery = async () => {
  const [rows] = await pool.query(
    `
    SELECT
      o.*,
      u.full_name AS customer_name,
      u.email AS customer_email,
      p.method AS payment_method,
      p.status AS payment_status
    FROM orders o
    JOIN users u ON u.id = o.user_id
    LEFT JOIN payments p ON p.order_id = o.id
    WHERE o.status IN ('PENDING', 'PAID', 'SHIPPING', 'WAITING_RECEIVED', 'COMPLETED', 'DONE')
    ORDER BY o.created_at DESC
    `
  );

  return rows;
};

const updateOrderStatus = async (id, status) => {
  await pool.query("UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [status, id]);
  return getOrderById(id);
};

const updateDeliveryStatus = async (id, status) => {
  await pool.query(
    "UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND status IN ('PENDING', 'PAID', 'SHIPPING', 'WAITING_RECEIVED', 'COMPLETED')",
    [status, id]
  );
  return getOrderById(id);
};

const createOrderFromCart = async ({ userId, shippingAddress, phoneNumber, note, paymentMethod, transactionRef }) => {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const [cartRows] = await conn.query("SELECT id FROM carts WHERE user_id = ? LIMIT 1", [userId]);
    if (!cartRows[0]) {
      const error = new Error("Cart not found");
      error.code = "CART_NOT_FOUND";
      throw error;
    }

    const cartId = cartRows[0].id;

    const [items] = await conn.query(
      `
      SELECT
        ci.id,
        ci.variant_id,
        ci.quantity,
        p.id AS product_id,
        p.price AS product_price,
        p.stock AS product_stock
      FROM cart_items ci
      JOIN product_variants pv ON pv.id = ci.variant_id
      JOIN products p ON p.id = pv.product_id
      WHERE ci.cart_id = ?
      FOR UPDATE
      `,
      [cartId]
    );

    if (items.length === 0) {
      const error = new Error("Cart is empty");
      error.code = "EMPTY_CART";
      throw error;
    }

    items.forEach((item) => {
      if (Number(item.product_stock) < Number(item.quantity)) {
        const error = new Error("Not enough stock for one or more products");
        error.code = "INSUFFICIENT_STOCK";
        throw error;
      }
    });

    const totalAmount = items.reduce(
      (sum, item) => sum + Number(item.product_price) * Number(item.quantity),
      0
    );

    const [orderResult] = await conn.query(
      `
      INSERT INTO orders (user_id, status, total_amount, shipping_address, phone_number, note)
      VALUES (?, 'PENDING', ?, ?, ?, ?)
      `,
      [userId, totalAmount, shippingAddress, phoneNumber, note || null]
    );

    const orderId = orderResult.insertId;

    for (const item of items) {
      const unitPrice = Number(item.product_price);
      const quantity = Number(item.quantity);
      const subtotal = unitPrice * quantity;

      await conn.query(
        `
        INSERT INTO order_items (order_id, variant_id, quantity, unit_price, subtotal)
        VALUES (?, ?, ?, ?, ?)
        `,
        [orderId, item.variant_id, quantity, unitPrice, subtotal]
      );

      await conn.query("UPDATE products SET stock = stock - ? WHERE id = ?", [quantity, item.product_id]);
    }

    await conn.query(
      `
      INSERT INTO payments (order_id, method, status, amount, transaction_ref)
      VALUES (?, ?, 'PENDING', ?, ?)
      `,
      [orderId, paymentMethod, totalAmount, transactionRef]
    );

    await conn.query("DELETE FROM cart_items WHERE cart_id = ?", [cartId]);

    await conn.commit();

    const [orderRows] = await pool.query("SELECT * FROM orders WHERE id = ? LIMIT 1", [orderId]);
    const [paymentRows] = await pool.query("SELECT * FROM payments WHERE order_id = ? LIMIT 1", [orderId]);

    return {
      order: orderRows[0] || null,
      payment: paymentRows[0] || null
    };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

module.exports = {
  getOrderById,
  getOrdersByUserId,
  getOrderByIdAndUserId,
  getOrdersForDelivery,
  updateOrderStatus,
  updateDeliveryStatus,
  createOrderFromCart
};
