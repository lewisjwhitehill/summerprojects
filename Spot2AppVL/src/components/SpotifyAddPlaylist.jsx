import React, { useEffect } from "react";
import { createSpotifyPlaylist, searchSpotify, addTrackToPlaylist } from "../../api/spotifyApi";

function SpotifyAddPlaylist({ playlistId, youtubeAccessToken, spotifyAccessToken }) {
  useEffect(() => {
    const convertPlaylistToSpotify = async () => {
      if (!playlistId || !youtubeAccessToken || !spotifyAccessToken) {
        console.error("Missing playlistId or one of the access tokens.");
        return;
      }

      // Fetch tracks from YouTube
      const youtubeResponse = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50`, {
        headers: { Authorization: `Bearer ${youtubeAccessToken}` },
      });
      const youtubeData = await youtubeResponse.json();
      const tracks = youtubeData.items.map(item => ({
        title: item.snippet.title,
        artist: item.snippet.channelTitle,
      }));

      console.log("YouTube Tracks:", tracks);

      // Create Spotify playlist
      const spotifyPlaylistId = await createSpotifyPlaylist(spotifyAccessToken, "My Converted Playlist");

      // Search Spotify and add tracks
      for (const track of tracks) {
        const query = `${track.title} ${track.artist}`;
        const spotifyResult = await searchSpotify(query, spotifyAccessToken);
        if (spotifyResult && spotifyResult.id) {
          await addTrackToPlaylist(spotifyAccessToken, spotifyPlaylistId, spotifyResult.id);
          console.log(`Added "${track.title}" to Spotify playlist`);
        } else {
          console.warn(`No Spotify match found for ${track.title} by ${track.artist}`);
        }
      }

      console.log("Spotify playlist creation complete!");
    };

    convertPlaylistToSpotify();
  }, [playlistId, youtubeAccessToken, spotifyAccessToken]);

  return <div><h2>Converting Playlist to Spotify...</h2></div>;
}

export default SpotifyAddPlaylist;
