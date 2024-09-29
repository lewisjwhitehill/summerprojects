// youtubeCallback.js
export default async function handler(req, res) {
    const code = req.query.code || null;
    const clientId = process.env.YOUTUBE_CLIENT_ID;
    const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
    const redirectUri = process.env.YOUTUBE_REDIRECT_URI;
  
    try {
      const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }),
      });
  
      const data = await response.json();
  
      if (data.access_token) {
        // Log the access token to verify it's correct
        console.log("Access token received:", data.access_token);
        res.redirect(`/?access_token=${data.access_token}&expires_in=${data.expires_in}`);
      } else {
        console.error("Failed to obtain access token:", data);
        res.status(400).json({ error: "Authorization failed" });
      }
    } catch (error) {
      console.error("Error fetching tokens:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  