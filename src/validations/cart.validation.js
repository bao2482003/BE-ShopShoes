const { body } = require("express-validator");

const addToCartValidation = [
  body("productId").isInt({ gt: 0 }).withMessage("productId must be a positive integer"),
  body("quantity").optional().isInt({ min: 1 }).withMessage("quantity must be at least 1")
];

const updateCartItemValidation = [
  body("quantity").isInt({ min: 1 }).withMessage("quantity must be at least 1")
];

module.exports = {
  addToCartValidation,
  updateCartItemValidation
};
