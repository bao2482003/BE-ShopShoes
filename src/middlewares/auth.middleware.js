const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next(new ApiError(401, "Missing or invalid authorization header"));
    return;
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.sub,
      role: decoded.role
    };
    next();
  } catch (error) {
    next(new ApiError(401, "Invalid or expired token"));
  }
};

module.exports = {
  authenticate
};
