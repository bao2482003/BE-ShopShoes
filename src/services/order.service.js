const crypto = require("crypto");
const ApiError = require("../utils/apiError");
const { toOrderResponse } = require("../models/order.model");
const { toPaymentResponse } = require("../models/payment.model");
const { buildPaymentUrl, verifyReturnParams } = require("../utils/vnpay");
const {
  createOrderFromCart,
  getOrderById,
  getOrdersByUserId,
  getOrderByIdAndUserId,
  updateOrderStatus,
  getOrdersForDelivery,
  updateDeliveryStatus
} = require("../repositories/order.repository");
const {
  getPaymentByTransactionRef,
  updatePaymentGatewayUrl,
  markPaymentPaid,
  markPaymentFailed,
  markPaymentDone
} = require("../repositories/payment.repository");

const createTransactionRef = () => `ORD${Date.now()}${crypto.randomInt(100, 999)}`;

const checkout = async ({ userId, shippingAddress, phoneNumber, note, paymentMethod, clientIp }) => {
  if (paymentMethod === "VNPAY") {
    const hasConfig =
      Boolean(process.env.VNPAY_TMN_CODE) &&
      Boolean(process.env.VNPAY_HASH_SECRET) &&
      Boolean(process.env.VNPAY_RETURN_URL);

    if (!hasConfig) {
      throw new ApiError(500, "Missing VNPAY configuration");
    }
  }

  const transactionRef = createTransactionRef();
  let created;

  try {
    created = await createOrderFromCart({
      userId,
      shippingAddress,
      phoneNumber,
      note,
      paymentMethod,
      transactionRef
    });
  } catch (error) {
    if (error.code === "CART_NOT_FOUND") {
      throw new ApiError(404, "Cart not found");
    }
    if (error.code === "EMPTY_CART") {
      throw new ApiError(400, "Cart is empty");
    }
    if (error.code === "INSUFFICIENT_STOCK") {
      throw new ApiError(400, "Not enough stock for one or more products");
    }
    if (error.code === "ER_NO_SUCH_TABLE") {
      throw new ApiError(500, "Database schema is missing tables. Please run schema.sql");
    }
    throw error;
  }

  if (!created.order || !created.payment) {
    throw new ApiError(500, "Cannot create order");
  }

  if (paymentMethod === "COD") {
    return {
      order: toOrderResponse(created.order),
      payment: toPaymentResponse(created.payment),
      message: "Order created. Please pay with cash on delivery"
    };
  }

  let paymentUrl;

  try {
    paymentUrl = buildPaymentUrl({
      amount: created.order.total_amount,
      transactionRef,
      orderInfo: `Thanh toan don hang #${created.order.id}`,
      ipAddr: clientIp
    });
  } catch (error) {
    throw new ApiError(500, error.message || "Cannot create VNPAY payment URL");
  }

  const payment = await updatePaymentGatewayUrl(created.order.id, paymentUrl);

  return {
    order: toOrderResponse(created.order),
    payment: toPaymentResponse(payment),
    paymentUrl
  };
};

const handleVnpayReturn = async (params) => {
  const isValid = verifyReturnParams(params);
  if (!isValid) {
    throw new ApiError(400, "Invalid VNPAY signature");
  }

  const transactionRef = params.vnp_TxnRef;
  const responseCode = params.vnp_ResponseCode;
  const transactionStatus = params.vnp_TransactionStatus;
  const transactionNo = params.vnp_TransactionNo;

  const payment = await getPaymentByTransactionRef(transactionRef);
  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  if (payment.status === "PAID") {
    return {
      orderId: payment.order_id,
      status: "success",
      message: "Payment already completed"
    };
  }

  const isSuccess = responseCode === "00" && transactionStatus === "00";

  if (isSuccess) {
    await markPaymentPaid({
      orderId: payment.order_id,
      vnpTransactionNo: transactionNo,
      vnpResponseCode: responseCode
    });
    await updateOrderStatus(payment.order_id, "PAID");

    return {
      orderId: payment.order_id,
      status: "success",
      message: "Payment successful"
    };
  }

  await markPaymentFailed({
    orderId: payment.order_id,
    vnpTransactionNo: transactionNo,
    vnpResponseCode: responseCode
  });
  await updateOrderStatus(payment.order_id, "CANCELLED");

  return {
    orderId: payment.order_id,
    status: "failed",
    message: "Payment failed"
  };
};

const getOrderSummary = async (orderId) => {
  const order = await getOrderById(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }
  return toOrderResponse(order);
};

const mapOrderHistoryRow = (row) => {
  const order = toOrderResponse(row);

  const payment = row.payment_id
    ? {
        id: row.payment_id,
        orderId: row.id,
        method: row.payment_method,
        status: row.payment_status,
        amount: Number(row.payment_amount),
        transactionRef: row.payment_transaction_ref,
        paidAt: row.payment_paid_at,
        createdAt: row.payment_created_at,
        updatedAt: row.payment_updated_at
      }
    : null;

  return {
    order,
    payment
  };
};

const listMyOrders = async (userId) => {
  const rows = await getOrdersByUserId(userId);
  return rows.map(mapOrderHistoryRow);
};

const getMyOrder = async (userId, orderId) => {
  const row = await getOrderByIdAndUserId(orderId, userId);
  if (!row) {
    throw new ApiError(404, "Order not found");
  }
  return mapOrderHistoryRow(row);
};

const listDeliveryOrders = async () => {
  const rows = await getOrdersForDelivery();
  return rows.map((row) => ({
    order: toOrderResponse(row),
    customer: {
      name: row.customer_name,
      email: row.customer_email
    },
    payment: {
      method: row.payment_method,
      status: row.payment_status
    }
  }));
};

const setDeliveryStatus = async (orderId, status) => {
  const order = await getOrderById(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (!["SHIPPING", "WAITING_RECEIVED"].includes(status)) {
    throw new ApiError(400, "delivery status must be SHIPPING or WAITING_RECEIVED");
  }

  const updated = await updateDeliveryStatus(orderId, status);
  if (!updated) {
    throw new ApiError(400, "Cannot update delivery status for this order");
  }

  return toOrderResponse(updated);
};

const confirmReceived = async (userId, orderId) => {
  const row = await getOrderByIdAndUserId(orderId, userId);
  if (!row) {
    throw new ApiError(404, "Order not found");
  }

  if (!["WAITING_RECEIVED", "COMPLETED"].includes(row.status)) {
    throw new ApiError(400, "Only waiting confirmation orders can be confirmed");
  }

  const updated = await updateOrderStatus(orderId, "DONE");
  if (!updated) {
    throw new ApiError(400, "Cannot confirm this order");
  }

  await markPaymentDone(orderId);
  return toOrderResponse(updated);
};

module.exports = {
  checkout,
  handleVnpayReturn,
  getOrderSummary,
  listMyOrders,
  getMyOrder,
  listDeliveryOrders,
  setDeliveryStatus,
  confirmReceived
};
