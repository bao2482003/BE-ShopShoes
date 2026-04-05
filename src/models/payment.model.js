const toPaymentResponse = (row) => ({
  id: row.id,
  orderId: row.order_id,
  method: row.method,
  status: row.status,
  amount: Number(row.amount),
  transactionRef: row.transaction_ref,
  vnpTransactionNo: row.vnp_transaction_no,
  vnpResponseCode: row.vnp_response_code,
  payUrl: row.pay_url,
  paidAt: row.paid_at,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

module.exports = {
  toPaymentResponse
};
