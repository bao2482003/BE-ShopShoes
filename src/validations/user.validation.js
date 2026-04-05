const { body } = require("express-validator");
const ROLES = require("../constants/roles");

const createUserValidation = [
  body("fullName").trim().notEmpty().withMessage("fullName is required"),
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters"),
  body("role")
    .optional()
    .isIn([ROLES.ADMIN, ROLES.STAFF, ROLES.USER])
    .withMessage("role must be ADMIN, STAFF or USER")
];

const updateUserValidation = [
  body("fullName").optional().trim().notEmpty().withMessage("fullName cannot be empty"),
  body("email").optional().isEmail().withMessage("Invalid email"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters"),
  body("role")
    .optional()
    .isIn([ROLES.ADMIN, ROLES.STAFF, ROLES.USER])
    .withMessage("role must be ADMIN, STAFF or USER")
];

module.exports = {
  createUserValidation,
  updateUserValidation
};
