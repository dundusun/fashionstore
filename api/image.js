/**
 * Vercel Serverless Function — /api/image
 *
 * Proxies DAM images from local AEM to the public browser, adding basic auth.
 * Usage:
 *   /api/image?path=/content/dam/fashion-app/products/silk-evening-gown.jpg
 */

export default async function handler(req, res) {
  const { path } = req.query;

  if (!path) {
    return res.status(400).json({ error: "Missing image path" });
  }

  const AEM_BASE_URL = process.env.AEM_BASE_URL ||
    "https://spellbind-bacterium-sternness.ngrok-free.dev";
  const AEM_AUTH = process.env.AEM_AUTH ||
    "Basic YWRtaW46YWRtaW4=";

  const aemImageUrl = `${AEM_BASE_URL}${path}`;

  try {
    const response = await fetch(aemImageUrl, {
      headers: {
        "Authorization": AEM_AUTH,
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (!response.ok) {
      return res.status(response.status).end();
    }

    // Forward image headers and stream the body
    const contentType = response.headers.get("content-type");
    if (contentType) {
      res.setHeader("Content-Type", contentType);
    }
    res.setHeader("Cache-Control", "public, max-age=86400"); // cache for 1 day

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return res.status(200).send(buffer);

  } catch (err) {
    return res.status(500).json({ error: "Failed to proxy image", message: err.message });
  }
}
