const toCartItemResponse = (row) => ({
  id: row.id,
  cartId: row.cart_id,
  variantId: row.variant_id,
  quantity: row.quantity,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

const toCartItemDetailResponse = (row) => ({
  id: row.id,
  cartId: row.cart_id,
  variantId: row.variant_id,
  quantity: row.quantity,
  product: {
    id: row.product_id,
    name: row.product_name,
    price: Number(row.product_price),
    imageUrl: row.product_image_url,
    size: row.variant_size,
    color: row.variant_color
  },
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

module.exports = {
  toCartItemResponse,
  toCartItemDetailResponse
};
