require("dotenv").config({});
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const { authMiddleware } = require("./middleware/auth");

const app = express();

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: "Too many requests, please try again later." },
});
app.use(limiter);

const loggerMiddleware = morgan("combined");

// ===== Route Config =====
const UserService = process.env.USER_SERVICE || "";
const PostService = process.env.POST_SERVICE || "";

const routeConfig = [
  {
    path: "/api/auth",
    target: UserService,
    middlewares: [],
  },
  {
    path: "/api/users",
    target: UserService,
    middlewares: [authMiddleware, loggerMiddleware],
  },
  {
    path: "/api/posts",
    target: PostService,
    middlewares: [authMiddleware],
  },
];

routeConfig.forEach(({ path, target, middlewares }) => {
  app.use(
    path,
    ...middlewares,
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: (reqPath, req) => {
        // Don't strip anything — forward full original URL
        return req.originalUrl;
      },
      onError: (err, req, res) => {
        console.error(
          `Proxy error for ${req.method} ${req.originalUrl}:`,
          err.message
        );
        res.status(502).json({ error: "Bad Gateway", details: err.message });
      },
      logLevel: "debug",
    })
  );
});

app.listen(8000, () => {
  console.log("API Gateway running on port 8000");
});
