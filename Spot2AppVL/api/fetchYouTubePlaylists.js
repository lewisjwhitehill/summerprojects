// api/fetchYouTubePlaylists.js

export default async function handler(req, res) {
    const accessToken = req.query.access_token; // Retrieve access token from the query params or elsewhere
  
    try {
      const response = await fetch("https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      const data = await response.json();
  
      if (data.items) {
        res.status(200).json({ playlists: data.items });
      } else {
        res.status(400).json({ error: "Failed to fetch playlists" });
      }
    } catch (error) {
      console.error("Error fetching playlists:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  