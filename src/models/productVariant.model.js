const toProductVariantResponse = (row) => ({
  id: row.id,
  productId: row.product_id,
  sku: row.sku,
  size: row.size,
  color: row.color,
  stock: row.stock,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

module.exports = {
  toProductVariantResponse
};
