const { body } = require("express-validator");

const createPostValidation = [
  body("title").isString().trim("body.title").withMessage("Title is required"),
  body("description").isString().trim().withMessage("Description is required"),
  body("userId").isString().trim().withMessage("UserId is required"),
];

module.exports = {
  createPostValidation,
};
