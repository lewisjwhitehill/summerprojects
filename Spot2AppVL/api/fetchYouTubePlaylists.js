// api/fetchYouTubePlaylists.js

export default async function handler(req, res) {
  const accessToken = req.query.access_token;
  if (!accessToken) {
      console.error("No access token provided");
      return res.status(400).json({ error: "Access token is required" });
  }

  try {
      const response = await fetch("https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true", {
          headers: { Authorization: `Bearer ${accessToken}` },
      });

      const data = await response.json();

      if (data.error) {
          console.error("YouTube API error:", data.error);
          return res.status(400).json({ error: data.error.message });
      }

      if (data.items) {
          res.status(200).json({ playlists: data.items });
      } else {
          res.status(404).json({ error: "No playlists found" });
      }
  } catch (error) {
      console.error("Error fetching playlists:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
}

  