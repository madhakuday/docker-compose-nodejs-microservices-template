const { body } = require("express-validator");

const registerValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/\d/)
    .withMessage("Password must contain a number")
    .matches(/[a-zA-Z]/)
    .withMessage("Password must contain a letter"),
];

const loginValidation = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/\d/)
    .withMessage("Password must contain a number")
    .matches(/[a-zA-Z]/)
    .withMessage("Password must contain a letter"),
];

const getUserValidation = [
  body("userId").isString().withMessage("UserId provide a valid email"),
];

module.exports = {
  registerValidation,
  loginValidation,
  getUserValidation,
};
