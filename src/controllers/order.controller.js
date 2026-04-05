const orderService = require("../services/order.service");

const checkout = async (req, res, next) => {
  try {
    const clientIp =
      req.headers["x-forwarded-for"]?.split(",")?.[0]?.trim() ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      "127.0.0.1";

    const data = await orderService.checkout({
      userId: req.user.id,
      shippingAddress: req.body.shippingAddress,
      phoneNumber: req.body.phoneNumber,
      note: req.body.note,
      paymentMethod: req.body.paymentMethod,
      clientIp
    });

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkout
};
