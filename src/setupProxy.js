const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/content",
    createProxyMiddleware({
      target: process.env.REACT_APP_AEM_URL || "https://spellbind-bacterium-sternness.ngrok-free.dev",
      changeOrigin: true,
      secure: false,
      pathRewrite: { "^/content": "/content" },
      headers: {
        "ngrok-skip-browser-warning": "true",
        "Authorization": "Basic YWRtaW46YWRtaW4=",
      },
    })
  );
};
