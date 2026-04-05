const orderService = require("../services/order.service");

const vnpayReturn = async (req, res, next) => {
  try {
    const result = await orderService.handleVnpayReturn(req.query);
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const redirectUrl = `${clientUrl}/payment-result?orderId=${result.orderId}&status=${result.status}&message=${encodeURIComponent(result.message)}&method=VNPAY`;
    res.redirect(redirectUrl);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  vnpayReturn
};
