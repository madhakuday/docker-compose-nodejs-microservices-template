const express = require("express");
const route = express.Router();
const userController = require("./user.controller");
const asyncHandler = require("../../middleware/asyncHandler");

route.get("/", asyncHandler(userController.getAllUsers));

route.post("/usersByIds", asyncHandler(userController.getUsersByIds));

module.exports = route;
