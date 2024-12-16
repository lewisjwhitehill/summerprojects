import React, { useEffect } from "react";
import { createSpotifyPlaylist, searchSpotify, addTrackToPlaylist, fetchSpotifyUserId } from "../../api/spotifyApi";

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
          .filter(item => item.snippet.title && item.snippet.channelTitle) // Exclude invalid tracks
          .map(item => ({
            title: item.snippet.title,
            artist: item.snippet.channelTitle,
          }));

        console.log("YouTube Tracks:", tracks);

        // Fetch Spotify user ID
        const userId = await fetchSpotifyUserId(spotifyAccessToken);

        // Create Spotify playlist
        const spotifyPlaylistId = await createSpotifyPlaylist(userId, spotifyAccessToken, "My Converted Playlist");

        // Search Spotify and add tracks
        for (const track of tracks) {
          const query = `${track.title} ${track.artist}`;
          const spotifyResult = await searchSpotify(query, spotifyAccessToken);

          if (spotifyResult && spotifyResult.id) {
            await addTrackToPlaylist(spotifyAccessToken, spotifyPlaylistId, `spotify:track:${spotifyResult.id}`);
            console.log(`Added "${track.title}" to Spotify playlist`);
          } else {
            console.warn(`No Spotify match found for ${track.title} by ${track.artist}`);
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
