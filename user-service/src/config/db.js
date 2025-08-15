const mongoose = require("mongoose");
const url = process.env.MONGODB_URL || "";

(() => {
  mongoose
    .connect(url)
    .then(() => console.log("DB connected"))
    .catch((err) => console.error("Error in db connection", err));
})();

module.exports = mongoose;
