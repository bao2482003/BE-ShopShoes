const express = require("express");
const brandController = require("../controllers/brand.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const ROLES = require("../constants/roles");
const validateRequest = require("../middlewares/validate.middleware");
const { createBrandValidation, updateBrandValidation } = require("../validations/brand.validation");

const router = express.Router();

router.use(authenticate, authorize(ROLES.ADMIN));

router.get("/", brandController.list);
router.get("/:id", brandController.getOne);
router.post("/", createBrandValidation, validateRequest, brandController.create);
router.put("/:id", updateBrandValidation, validateRequest, brandController.update);
router.delete("/:id", brandController.remove);

module.exports = router;
