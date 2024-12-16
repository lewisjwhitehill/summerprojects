import React, { useEffect } from "react";
import { createSpotifyPlaylist, searchSpotify, addTrackToPlaylist } from "../../api/spotifyApi";

function SpotifyAddPlaylist({ playlistId, youtubeAccessToken, spotifyAccessToken }) {
  useEffect(() => {
    const convertPlaylistToSpotify = async () => {
      try {
        if (!playlistId || !youtubeAccessToken || !spotifyAccessToken) {
          console.error("Missing playlistId or one of the access tokens.");
          return;
        }

        // Fetch tracks from YouTube
        const youtubeResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50`,
          {
            headers: { Authorization: `Bearer ${youtubeAccessToken}` },
          }
        );

        if (!youtubeResponse.ok) {
          throw new Error("Failed to fetch YouTube tracks");
        }

        const youtubeData = await youtubeResponse.json();
        const tracks = youtubeData.items
          .filter(item => item.snippet.title && item.snippet.channelTitle)
          .map(item => ({
            title: item.snippet.title,
            artist: item.snippet.channelTitle,
          }));

        if (tracks.length === 0) {
          console.warn("No valid tracks found in YouTube playlist.");
          return;
        }

        console.log("YouTube Tracks:", tracks);

        // Create Spotify playlist
        const spotifyPlaylistId = await createSpotifyPlaylist(spotifyAccessToken, "My Converted Playlist");

        // Search Spotify and add tracks
        for (const track of tracks) {
          try {
            const query = `${track.title} artist:${track.artist}`;
            console.log("Search Query:", query); // Log the search query
            const spotifyResult = await searchSpotify(query, spotifyAccessToken);

            if (spotifyResult && spotifyResult.id) {
              await addTrackToPlaylist(spotifyAccessToken, spotifyPlaylistId, `spotify:track:${spotifyResult.id}`);
              console.log(`Added "${track.title}" to Spotify playlist`);
            } else {
              console.warn(`No Spotify match found for "${track.title}" by "${track.artist}"`);
            }
          } catch (error) {
            console.error(`Error adding track "${track.title}" to Spotify:`, error);
          }
        }

        console.log("Spotify playlist creation complete!");
      } catch (error) {
        console.error("Error converting YouTube playlist to Spotify:", error);
      }
    };

    convertPlaylistToSpotify();
  }, [playlistId, youtubeAccessToken, spotifyAccessToken]);

  return <div><h2>Converting Playlist to Spotify...</h2></div>;
}

export default SpotifyAddPlaylist;
