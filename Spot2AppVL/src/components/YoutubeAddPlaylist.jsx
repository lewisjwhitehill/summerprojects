import { createYouTubePlaylist, searchYouTube, addVideoToPlaylist } from "../../api/youtubeApi";
import React, { useEffect } from "react";

function YouTubeAddPlaylist({ playlistId, spotifyAccessToken, youtubeAccessToken }) {
  useEffect(() => {
    const convertPlaylistToYouTube = async () => {
      try {
        if (!playlistId || !spotifyAccessToken || !youtubeAccessToken) {
          console.error("Missing playlistId or one of the access tokens.");
          return;
        }

        // 1. Fetch Spotify playlist details
        const playlistResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
          headers: { Authorization: `Bearer ${spotifyAccessToken}` },
        });

        if (!playlistResponse.ok) {
          console.error("Spotify playlist fetch error:", playlistResponse.status, playlistResponse.statusText);
          throw new Error("Failed to fetch Spotify playlist details");
        }

        const playlistData = await playlistResponse.json();
        const playlistTitle = playlistData.name; // Extract Spotify playlist title
        console.log("Spotify Playlist Title:", playlistTitle);

        // 2. Fetch Spotify tracks
        const tracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          headers: { Authorization: `Bearer ${spotifyAccessToken}` },
        });

        if (!tracksResponse.ok) {
          console.error("Spotify tracks fetch error:", tracksResponse.status, tracksResponse.statusText);
          throw new Error("Failed to fetch Spotify tracks");
        }

        const tracksData = await tracksResponse.json();
        const tracks = tracksData.items
          .filter(item => item.track && item.track.artists && item.track.artists.length > 0)
          .map(item => ({
            title: item.track.name,
            artist: item.track.artists[0].name,
          }));

        console.log("Spotify Tracks:", tracks);

        // 3. Create a YouTube playlist with the Spotify playlist title
        const youtubePlaylistId = await createYouTubePlaylist(youtubeAccessToken, playlistTitle);

        // 4. For each track, search YouTube and add to the playlist
        for (const track of tracks) {
          const query = `${track.title} ${track.artist}`;
          console.log("YouTube Search Query:", query);

          const youtubeResult = await searchYouTube(query, youtubeAccessToken);

          if (youtubeResult && youtubeResult.id && youtubeResult.id.videoId) {
            await addVideoToPlaylist(youtubeAccessToken, youtubePlaylistId, youtubeResult.id.videoId);
            console.log(`Added "${track.title}" to YouTube playlist`);
          } else {
            console.warn(`No YouTube match found for ${track.title} by ${track.artist}`);
          }
        }

        console.log("YouTube playlist creation complete!");
      } catch (error) {
        console.error("Error converting playlist:", error);
      }
    };

    convertPlaylistToYouTube();
  }, [playlistId, spotifyAccessToken, youtubeAccessToken]);

  return (
    <div>
      
    </div>
  );
}

export default YouTubeAddPlaylist;
