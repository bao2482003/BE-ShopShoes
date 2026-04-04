const express = require("express");
const productController = require("../controllers/product.controller");
const uploadController = require("../controllers/upload.controller");
const upload = require("../config/multer");
const ROLES = require("../constants/roles");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const validateRequest = require("../middlewares/validate.middleware");
const { createProductValidation, updateProductValidation } = require("../validations/product.validation");

const router = express.Router();

router.get("/", productController.list);
router.get("/:id", productController.getOne);

router.post(
  "/",
  authenticate,
  authorize(ROLES.ADMIN),
  upload.single("image"),
  createProductValidation,
  validateRequest,
  productController.create
);

router.put(
  "/:id",
  authenticate,
  authorize(ROLES.ADMIN),
  upload.single("image"),
  updateProductValidation,
  validateRequest,
  productController.update
);

router.delete("/:id", authenticate, authorize(ROLES.ADMIN), productController.remove);
router.post("/upload", authenticate, authorize(ROLES.ADMIN), upload.single("image"), uploadController.uploadImage);

module.exports = router;
