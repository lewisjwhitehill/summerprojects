// api/callback.js

export default async function handler(req, res) {
  const code = req.query.code || null;
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirectUri,
    }),
  });

  const data = await response.json();

  if (data.access_token) {
    // Include access_token and expires_in in the redirect URL
    res.redirect(`/?access_token=${data.access_token}&expires_in=${data.expires_in}`);
  } else {
    res.status(400).json({ error: "Authorization failed" });
  }
}

