const toCartResponse = (row) => ({
  id: row.id,
  userId: row.user_id,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

module.exports = {
  toCartResponse
};
