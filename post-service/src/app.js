require("dotenv").config({});

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// Route
const routes = require("./api");

//DB
require("./config/db");

const port = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

// Routes
app.use("/api", routes);

app.get("/health-check", (req, res) => {
  res.send("App is running");
});

app.get("/", (req, res) => {
  res.send("Route not found");
});

app.listen(port, () => {
  console.log(`App is running on ${process.env.BACKEND_DOMAIN || port}`);
});
