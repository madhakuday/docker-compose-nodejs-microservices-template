const express = require("express");
const route = express.Router();

// -- Route imports
const postRoutes = require("./post/post.route");
// -- Route imports

// Post
route.use("/posts", postRoutes);

module.exports = route;
