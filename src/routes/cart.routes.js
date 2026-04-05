const express = require("express");
const cartController = require("../controllers/cart.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const validateRequest = require("../middlewares/validate.middleware");
const { addToCartValidation, updateCartItemValidation } = require("../validations/cart.validation");

const router = express.Router();

router.use(authenticate);

router.get("/", cartController.getMine);
router.post("/items", addToCartValidation, validateRequest, cartController.addItem);
router.patch("/items/:itemId", updateCartItemValidation, validateRequest, cartController.updateItem);
router.delete("/items/:itemId", cartController.removeItem);

module.exports = router;
