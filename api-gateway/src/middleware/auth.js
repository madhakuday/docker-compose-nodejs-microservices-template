const jwt = require("jsonwebtoken");
const axios = require("axios");

const UserService = process.env.USER_SERVICE || "";
const JWT_SECRET = process.env.WEB_TOKEN_SECRET || "";

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Missing Authorization header" });
    }
    const token = authHeader.split(" ")[1];

    if (!token)
      return res
        .status(401)
        .json({ error: "Invalid Authorization header format" });

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    try {
      const resp = await axios.post(
        `${UserService}/api/auth/getUser`,
        { userId: payload.sub || payload.userId || payload.id },
        {
          timeout: 3000,
        }
      );
      const user = resp.data;
      req.user = user;
    } catch (err) {
      console.error("Failed to fetch user from internal auth:", err.message);
      return res.status(503).json({ error: "User service unavailable" });
    }

    next();
  } catch (err) {
    console.error("authMiddleware error", err);
    return res.status(500).json({ error: "Internal gateway error" });
  }
}

module.exports = {
  authMiddleware,
};
