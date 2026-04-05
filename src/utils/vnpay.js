const crypto = require("crypto");

const formatDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${y}${m}${d}${hh}${mm}${ss}`;
};

const sortObject = (obj) => {
  const sorted = {};
  Object.keys(obj)
    .sort()
    .forEach((key) => {
      sorted[key] = obj[key];
    });
  return sorted;
};

const signParams = (params, secret) => {
  const sorted = sortObject(params);
  const signData = new URLSearchParams(sorted).toString();
  return crypto.createHmac("sha512", secret).update(signData, "utf-8").digest("hex");
};

const buildPaymentUrl = ({ amount, transactionRef, orderInfo, ipAddr }) => {
  const tmnCode = process.env.VNPAY_TMN_CODE;
  const hashSecret = process.env.VNPAY_HASH_SECRET;
  const baseUrl = process.env.VNPAY_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
  const returnUrl = process.env.VNPAY_RETURN_URL;

  if (!tmnCode || !hashSecret || !returnUrl) {
    throw new Error("Missing VNPAY configuration");
  }

  const now = new Date();
  const expire = new Date(now.getTime() + 15 * 60 * 1000);

  const params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: transactionRef,
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: "other",
    vnp_Amount: Math.round(Number(amount) * 100),
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr || "127.0.0.1",
    vnp_CreateDate: formatDate(now),
    vnp_ExpireDate: formatDate(expire)
  };

  const secureHash = signParams(params, hashSecret);
  const query = new URLSearchParams({ ...sortObject(params), vnp_SecureHash: secureHash }).toString();
  return `${baseUrl}?${query}`;
};

const verifyReturnParams = (rawParams) => {
  const hashSecret = process.env.VNPAY_HASH_SECRET;
  if (!hashSecret) {
    throw new Error("Missing VNPAY hash secret");
  }

  const params = { ...rawParams };
  const secureHash = params.vnp_SecureHash;
  delete params.vnp_SecureHash;
  delete params.vnp_SecureHashType;

  const calculated = signParams(params, hashSecret);
  return secureHash === calculated;
};

module.exports = {
  buildPaymentUrl,
  verifyReturnParams
};
