const axios = require("axios");

exports.handler = async function (event) {
  const path = event.queryStringParameters.path;

  try {
    const response = await axios.get(
      `https://spellbind-bacterium-sternness.ngrok-free.dev${path}`,
      {
        headers: {
          "Authorization": "Basic " + Buffer.from("admin:admin").toString("base64"),
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(response.data),
    };
  } catch (err) {
    return {
      statusCode: err.response?.status || 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
