const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware({
      pathFilter: "/content",
      target: "https://spellbind-bacterium-sternness.ngrok-free.dev",
      changeOrigin: true,
      secure: false,
      headers: {
        "ngrok-skip-browser-warning": "true",
        "Authorization": "Basic YWRtaW46YWRtaW4=",
      },
    })
  );
};
