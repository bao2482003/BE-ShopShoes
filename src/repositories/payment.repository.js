const pool = require("../config/db");

const getPaymentByOrderId = async (orderId) => {
  const [rows] = await pool.query("SELECT * FROM payments WHERE order_id = ? LIMIT 1", [orderId]);
  return rows[0] || null;
};

const getPaymentByTransactionRef = async (transactionRef) => {
  const [rows] = await pool.query("SELECT * FROM payments WHERE transaction_ref = ? LIMIT 1", [transactionRef]);
  return rows[0] || null;
};

const updatePaymentGatewayUrl = async (orderId, payUrl) => {
  await pool.query(
    "UPDATE payments SET pay_url = ?, updated_at = CURRENT_TIMESTAMP WHERE order_id = ?",
    [payUrl, orderId]
  );
  return getPaymentByOrderId(orderId);
};

const markPaymentPaid = async ({ orderId, vnpTransactionNo, vnpResponseCode }) => {
  await pool.query(
    `
    UPDATE payments
    SET status = 'PAID',
        vnp_transaction_no = ?,
        vnp_response_code = ?,
        paid_at = NOW(),
        updated_at = CURRENT_TIMESTAMP
    WHERE order_id = ?
    `,
    [vnpTransactionNo || null, vnpResponseCode || null, orderId]
  );

  return getPaymentByOrderId(orderId);
};

const markPaymentFailed = async ({ orderId, vnpTransactionNo, vnpResponseCode }) => {
  await pool.query(
    `
    UPDATE payments
    SET status = 'FAILED',
        vnp_transaction_no = ?,
        vnp_response_code = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE order_id = ?
    `,
    [vnpTransactionNo || null, vnpResponseCode || null, orderId]
  );

  return getPaymentByOrderId(orderId);
};

const markPaymentDone = async (orderId) => {
  await pool.query(
    `
    UPDATE payments
    SET status = 'DONE',
        paid_at = COALESCE(paid_at, NOW()),
        updated_at = CURRENT_TIMESTAMP
    WHERE order_id = ?
    `,
    [orderId]
  );

  return getPaymentByOrderId(orderId);
};

module.exports = {
  getPaymentByOrderId,
  getPaymentByTransactionRef,
  updatePaymentGatewayUrl,
  markPaymentPaid,
  markPaymentFailed,
  markPaymentDone
};
