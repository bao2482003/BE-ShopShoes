const { body } = require("express-validator");

const createBrandValidation = [
  body("name").trim().notEmpty().withMessage("Name is required")
];

const updateBrandValidation = [
  body("name").trim().notEmpty().withMessage("Name is required")
];

module.exports = {
  createBrandValidation,
  updateBrandValidation
};
