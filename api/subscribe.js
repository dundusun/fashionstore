export default async function handler(req, res) {
  // CORS configuration
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: "Please provide a valid email address." });
    }

    // ──────────────────────────────────────────────────────────
    // FUTURE DATABASE CONNECTION GOES HERE
    // e.g., await db.collection("subscribers").insertOne({ email, date: new Date() });
    // ──────────────────────────────────────────────────────────
    
    // Simulate a slight delay to feel like a real DB connection
    await new Promise((resolve) => setTimeout(resolve, 800));

    console.log(`[Backend Log] New subscriber saved: ${email}`);

    // Return success to the React frontend
    return res.status(200).json({ 
      success: true, 
      message: "Successfully subscribed to the VIP Club!" 
    });

  } catch (error) {
    console.error("Subscription error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
