const { body } = require("express-validator");

const createProductValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("brand").trim().notEmpty().withMessage("Brand is required"),
  body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),
  body("stock").isInt({ min: 0 }).withMessage("Stock must be >= 0"),
  body("description").optional().isString()
];

const updateProductValidation = [
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
  body("brand").optional().trim().notEmpty().withMessage("Brand cannot be empty"),
  body("price").optional().isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),
  body("stock").optional().isInt({ min: 0 }).withMessage("Stock must be >= 0"),
  body("description").optional().isString()
];

module.exports = {
  createProductValidation,
  updateProductValidation
};
