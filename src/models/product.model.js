const toProductResponse = (row) => ({
  id: row.id,
  name: row.name,
  brand: row.brand,
  price: Number(row.price),
  stock: row.stock,
  description: row.description,
  imageUrl: row.image_url,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

module.exports = {
  toProductResponse
};
