const express = require("express");
const orderController = require("../controllers/order.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const ROLES = require("../constants/roles");
const validateRequest = require("../middlewares/validate.middleware");
const {
	checkoutValidation,
	updateDeliveryStatusValidation
} = require("../validations/order.validation");

const router = express.Router();

router.use(authenticate);

router.get("/my", orderController.getMyOrders);
router.get("/:id", orderController.getMyOrder);
router.post("/checkout", checkoutValidation, validateRequest, orderController.checkout);
router.patch("/:id/confirm-received", orderController.confirmReceived);
router.get("/delivery/list", authorize(ROLES.STAFF), orderController.getDeliveryOrders);
router.patch(
	"/delivery/:id/status",
	authorize(ROLES.STAFF),
	updateDeliveryStatusValidation,
	validateRequest,
	orderController.updateDeliveryStatus
);

module.exports = router;
