const { body } = require("express-validator");

const checkoutValidation = [
  body("shippingAddress")
    .trim()
    .notEmpty()
    .withMessage("shippingAddress is required")
    .isLength({ min: 6 })
    .withMessage("shippingAddress must be at least 6 characters"),
  body("phoneNumber")
    .trim()
    .notEmpty()
    .withMessage("phoneNumber is required")
    .isLength({ min: 8, max: 20 })
    .withMessage("phoneNumber length is invalid"),
  body("note").optional().isString(),
  body("paymentMethod")
    .isIn(["COD", "VNPAY"])
    .withMessage("paymentMethod must be COD or VNPAY")
];

module.exports = {
  checkoutValidation
};
