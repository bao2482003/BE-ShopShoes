const express = require("express");
const authRoutes = require("./auth.routes");
const productRoutes = require("./product.routes");

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ message: "Backend is running" });
});

router.use("/auth", authRoutes);
router.use("/products", productRoutes);

module.exports = router;
