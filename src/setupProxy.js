const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  // Proxy all AEM paths to local AEM instance
  app.use(
    createProxyMiddleware({
      pathFilter: ["/content", "/bin", "/libs", "/apps"],
      target: "http://localhost:4503",
      changeOrigin: true,
      secure: false,
      // Publish usually doesn't need Auth, but we can leave it or remove it. Leaving it is safe.
      headers: {
        "Authorization": "Basic YWRtaW46YWRtaW4=",
      },
    })
  );
};
