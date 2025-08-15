const { validationResult } = require("express-validator");
const { sendErrorResponse } = require("../utils/responseHandler");

const validate = (validators = []) => {
  return async (req, res, next) => {
    try {
      await Promise.all(validators.map((validator) => validator?.run(req)));

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return sendErrorResponse(res, "Validation error", 400, errors.array());
      }

      next();
    } catch (error) {
      return sendErrorResponse(
        res,
        "Internal server error during validation",
        500
      );
    }
  };
};

module.exports = validate;
