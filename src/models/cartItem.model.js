const toCartItemResponse = (row) => ({
  id: row.id,
  cartId: row.cart_id,
  variantId: row.variant_id,
  quantity: row.quantity,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

module.exports = {
  toCartItemResponse
};
