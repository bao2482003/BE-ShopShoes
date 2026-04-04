const toBrandResponse = (row) => ({
  id: row.id,
  name: row.name,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

module.exports = {
  toBrandResponse
};
