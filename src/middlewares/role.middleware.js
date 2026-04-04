const ApiError = require("../utils/apiError");

const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    next(new ApiError(401, "Unauthorized"));
    return;
  }

  if (!roles.includes(req.user.role)) {
    next(new ApiError(403, "Forbidden"));
    return;
  }

  next();
};

module.exports = {
  authorize
};
