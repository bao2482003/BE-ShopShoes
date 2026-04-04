const toOrderItemResponse = (row) => ({
  id: row.id,
  orderId: row.order_id,
  variantId: row.variant_id,
  quantity: row.quantity,
  unitPrice: Number(row.unit_price),
  subtotal: Number(row.subtotal),
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

module.exports = {
  toOrderItemResponse
};
