const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError");
const ROLES = require("../constants/roles");
const { findUserByEmail, findUserById, createUser } = require("../repositories/user.repository");
const { toPublicUser } = require("../models/user.model");

const buildToken = (user) =>
  jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });

const register = async ({ fullName, email, password }) => {
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new ApiError(409, "Email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser({
    fullName,
    email,
    passwordHash,
    role: ROLES.USER
  });

  const token = buildToken(user);

  return {
    user: toPublicUser(user),
    token
  };
};

const login = async ({ email, password }) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = buildToken(user);
  return {
    user: toPublicUser(user),
    token
  };
};

const getMe = async (id) => {
  const user = await findUserById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return toPublicUser(user);
};

module.exports = {
  register,
  login,
  getMe
};
