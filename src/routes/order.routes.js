const express = require("express");
const orderController = require("../controllers/order.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const validateRequest = require("../middlewares/validate.middleware");
const { checkoutValidation } = require("../validations/order.validation");

const router = express.Router();

router.use(authenticate);

router.post("/checkout", checkoutValidation, validateRequest, orderController.checkout);

module.exports = router;
