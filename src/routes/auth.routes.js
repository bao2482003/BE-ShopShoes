const express = require("express");
const authController = require("../controllers/auth.controller");
const validateRequest = require("../middlewares/validate.middleware");
const { authenticate } = require("../middlewares/auth.middleware");
const { registerValidation, loginValidation } = require("../validations/auth.validation");

const router = express.Router();

router.post("/register", registerValidation, validateRequest, authController.register);
router.post("/login", loginValidation, validateRequest, authController.login);
router.get("/me", authenticate, authController.me);

module.exports = router;
