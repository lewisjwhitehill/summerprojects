export default function handler(req, res) {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
    const scopes = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative user-library-read user-top-read';
  
    // Log the values for debugging
    console.log('Client ID:', clientId);
    console.log('Redirect URI:', redirectUri);
  
    //const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    const authUrl = 'https://www.youtube.com';

    // Log the authorization URL for verification
    console.log('Authorization URL:', authUrl);
  
    // Perform the redirect
    res.redirect(authUrl);  // Removed the extra closing parenthesis
  }
  