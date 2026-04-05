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

const getMyOrders = async (req, res, next) => {
  try {
    const data = await orderService.listMyOrders(req.user.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const getMyOrder = async (req, res, next) => {
  try {
    const data = await orderService.getMyOrder(req.user.id, Number(req.params.id));
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const getDeliveryOrders = async (req, res, next) => {
  try {
    const data = await orderService.listDeliveryOrders();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const updateDeliveryStatus = async (req, res, next) => {
  try {
    const data = await orderService.setDeliveryStatus(Number(req.params.id), req.body.status);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const confirmReceived = async (req, res, next) => {
  try {
    const data = await orderService.confirmReceived(req.user.id, Number(req.params.id));
    res.json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkout,
  getMyOrders,
  getMyOrder,
  getDeliveryOrders,
  updateDeliveryStatus,
  confirmReceived
};
