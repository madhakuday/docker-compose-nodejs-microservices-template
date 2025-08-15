const mongoose = require("mongoose");
const url = process.env.MONGODB_URL || "";

(() => {
  mongoose
    .connect(url)
    .then(() => console.log("DB connected"))
    .catch((err) => console.log("Error in db connection", err.message));
})();

module.exports = mongoose;
