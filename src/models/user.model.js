const toPublicUser = (row) => ({
  id: row.id,
  fullName: row.full_name,
  email: row.email,
  role: row.role,
  createdAt: row.created_at
});

module.exports = {
  toPublicUser
};
