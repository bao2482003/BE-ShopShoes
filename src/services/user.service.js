const bcrypt = require("bcryptjs");
const ApiError = require("../utils/apiError");
const ROLES = require("../constants/roles");
const { toPublicUser } = require("../models/user.model");
const {
  findUserByEmail,
  findUserById,
  createUser,
  listUsers,
  updateUser,
  deleteUser
} = require("../repositories/user.repository");

const getAllUsers = async () => {
  const rows = await listUsers();
  return rows.map(toPublicUser);
};

const createByAdmin = async ({ fullName, email, password, role }) => {
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new ApiError(409, "Email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser({
    fullName,
    email,
    passwordHash,
    role: role || ROLES.USER
  });

  return toPublicUser(user);
};

const updateByAdmin = async (id, payload) => {
  const existing = await findUserById(id);
  if (!existing) {
    throw new ApiError(404, "User not found");
  }

  if (payload.email && payload.email !== existing.email) {
    const conflict = await findUserByEmail(payload.email);
    if (conflict && conflict.id !== id) {
      throw new ApiError(409, "Email already exists");
    }
  }

  const mapped = {
    full_name: payload.fullName,
    email: payload.email,
    role: payload.role
  };

  if (payload.password) {
    mapped.password = await bcrypt.hash(payload.password, 10);
  }

  const user = await updateUser(id, mapped);
  return toPublicUser(user);
};

const removeByAdmin = async (id, actorId) => {
  if (id === actorId) {
    throw new ApiError(400, "You cannot delete your own account");
  }

  const existing = await findUserById(id);
  if (!existing) {
    throw new ApiError(404, "User not found");
  }

  await deleteUser(id);
};

module.exports = {
  getAllUsers,
  createByAdmin,
  updateByAdmin,
  removeByAdmin
};
