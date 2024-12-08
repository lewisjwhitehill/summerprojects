import React, { useEffect } from "react";

function YouTubeAddPlaylist({ playlistId, accessToken }) {
  useEffect(() => {
    const convertPlaylistToYouTube = async () => {
      try {
        // Step 1: Fetch Spotify tracks
        const spotifyResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!spotifyResponse.ok) {
          throw new Error("Failed to fetch Spotify tracks");
        }

        const spotifyData = await spotifyResponse.json();
        const tracks = spotifyData.items.map((item) => ({
          title: item.track.name,
          artist: item.track.artists[0].name,
        }));

        console.log("Spotify Tracks:", tracks);

        // Step 2: Search for tracks on YouTube and create a playlist
        // Replace this with actual YouTube API calls
        // Example: Search YouTube for each track and then add to a new playlist

        // Placeholder code
        tracks.forEach((track) => {
          console.log(`Searching YouTube for: ${track.title} by ${track.artist}`);
        });

        console.log("YouTube playlist creation simulated.");
      } catch (error) {
        console.error("Error converting playlist:", error);
      }
    };

    convertPlaylistToYouTube();
  }, [playlistId, accessToken]);

  return (
    <div>
      <h2>Converting Playlist to YouTube...</h2>
    </div>
  );
}

export default YouTubeAddPlaylist;