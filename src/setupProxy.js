const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  // Proxy all AEM paths to local AEM instance
  app.use(
    createProxyMiddleware({
      pathFilter: ["/content", "/bin", "/libs", "/apps"],
      target: "http://localhost:4502",
      changeOrigin: true,
      secure: false,
      headers: {
        "Authorization": "Basic YWRtaW46YWRtaW4=",
      },
    })
  );
};
