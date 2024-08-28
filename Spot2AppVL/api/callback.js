// api/callback.js

export default async function handler(req, res) {
    const code = req.query.code || null;
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
  
    // Prepare the data to exchange the authorization code for an access token
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      }),
    });
  
    const data = await response.json();
  
    if (data.access_token) {
      // Store the access token securely, e.g., in a session or database
      // Redirect the user to a dashboard or another page with the access token as a query parameter
      res.redirect(`/dashboard?access_token=${data.access_token}`);
    } else {
      res.status(400).json({ error: 'Authorization failed' });
    }
  }