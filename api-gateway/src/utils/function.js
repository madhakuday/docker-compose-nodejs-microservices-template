// ---------- Utility helpers ----------
function cacheKey(req) {
  // include path, query, and auth context if needed
  const q = Object.keys(req.query)
    .sort()
    .map((k) => `${k}=${req.query[k]}`)
    .join("&");
  const uid = req.headers["x-user-id"] || "";
  return `cache:${req.method}:${req.path}?${q}:uid=${uid}`;
}

module.exports = {
  cacheKey,
};
