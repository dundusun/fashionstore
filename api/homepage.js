/**
 * Vercel Serverless Function — /api/homepage
 *
 * Acts as a secure proxy between the React frontend (Vercel) and AEM (via ngrok).
 * Credentials are stored as Vercel Environment Variables — never exposed to the browser.
 *
 * Environment variables required in Vercel dashboard:
 *   AEM_BASE_URL  = https://spellbind-bacterium-sternness.ngrok-free.dev
 *   AEM_AUTH      = Basic YWRtaW46YWRtaW4=   (base64 of admin:admin)
 *
 * Usage from React:
 *   fetch('/api/homepage')
 */

export default async function handler(req, res) {
  // CORS — allow the Vercel frontend to call this function
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const AEM_BASE_URL = process.env.AEM_BASE_URL ||
    "https://spellbind-bacterium-sternness.ngrok-free.dev";
  const AEM_AUTH = process.env.AEM_AUTH ||
    "Basic YWRtaW46YWRtaW4=";

  const aemUrl = `${AEM_BASE_URL}/content/fashionstore/us/en/home.homedata`;

  try {
    const response = await fetch(aemUrl, {
      headers: {
        "Authorization": AEM_AUTH,
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `AEM returned ${response.status}`,
        url: aemUrl,
      });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({
      error: "Failed to fetch from AEM",
      message: err.message,
    });
  }
}
