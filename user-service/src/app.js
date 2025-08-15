require("dotenv").config({});

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// Route
const routes = require("./api");

//DB
require("./config/db");

const port = process.env.PORT || 8003;
// const port = 8005;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

// Routes

// Log every incoming request
app.use((req, res, next) => {
  console.log(`[SERVICE 8003] ${req.method} ${req.originalUrl}`);
  next();
});

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
