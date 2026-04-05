const express = require("express");
const authRoutes = require("./auth.routes");
const productRoutes = require("./product.routes");
const cartRoutes = require("./cart.routes");
const orderRoutes = require("./order.routes");
const paymentRoutes = require("./payment.routes");
const userRoutes = require("./user.routes");
const brandRoutes = require("./brand.routes");

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ message: "Backend is running" });
});

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/payments", paymentRoutes);
router.use("/users", userRoutes);
router.use("/brands", brandRoutes);

module.exports = router;
