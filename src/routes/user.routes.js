const express = require("express");
const userController = require("../controllers/user.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const ROLES = require("../constants/roles");
const validateRequest = require("../middlewares/validate.middleware");
const { createUserValidation, updateUserValidation } = require("../validations/user.validation");

const router = express.Router();

router.use(authenticate, authorize(ROLES.ADMIN));

router.get("/", userController.list);
router.post("/", createUserValidation, validateRequest, userController.create);
router.put("/:id", updateUserValidation, validateRequest, userController.update);
router.delete("/:id", userController.remove);

module.exports = router;
