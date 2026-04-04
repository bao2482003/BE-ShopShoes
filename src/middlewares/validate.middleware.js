const { validationResult } = require("express-validator");

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      message: "Validation error",
      errors: errors.array()
    });
    return;
  }

  next();
};

module.exports = validateRequest;
