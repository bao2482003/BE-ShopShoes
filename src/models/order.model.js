const toOrderResponse = (row) => ({
  id: row.id,
  userId: row.user_id,
  status: row.status,
  totalAmount: Number(row.total_amount),
  shippingAddress: row.shipping_address,
  phoneNumber: row.phone_number,
  note: row.note,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

module.exports = {
  toOrderResponse
};
