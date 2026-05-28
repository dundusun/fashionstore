const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/aem",
    createProxyMiddleware({
      target: process.env.REACT_APP_AEM_URL || "https://spellbind-bacterium-sternness.ngrok-free.dev",
      changeOrigin: true,
      secure: false,
      pathRewrite: { "^/aem": "" },
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    })
  );
};
