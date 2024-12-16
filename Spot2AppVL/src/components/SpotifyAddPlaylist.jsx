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

        // 1. Fetch YouTube playlist details to get the playlist title
        const youtubePlaylistResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}`,
          {
            headers: { Authorization: `Bearer ${youtubeAccessToken}` },
          }
        );

        if (!youtubePlaylistResponse.ok) {
          throw new Error("Failed to fetch YouTube playlist details");
        }

        const youtubePlaylistData = await youtubePlaylistResponse.json();
        const youtubePlaylistTitle = youtubePlaylistData.items[0]?.snippet.title || "Converted Playlist";
        console.log("YouTube Playlist Title:", youtubePlaylistTitle);

        // 2. Fetch playlist items (tracks) from YouTube
        const youtubeTracksResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50`,
          {
            headers: { Authorization: `Bearer ${youtubeAccessToken}` },
          }
        );

        if (!youtubeTracksResponse.ok) {
          throw new Error("Failed to fetch YouTube tracks");
        }

        const youtubeTracksData = await youtubeTracksResponse.json();

        const cleanTitle = (title) => title.replace(/\(.*?\)|\[.*?\]/g, "").trim();
        const cleanArtist = (artist) => artist.replace(/\s-\sTopic$/i, "").trim();

        const extractArtistAndTitle = (title) => {
          const match = title.match(/^(.*?)\s-\s(.*)$/);
          if (match) {
            return { artist: match[1].trim(), title: match[2].trim() };
          }
          return { artist: null, title: title.trim() };
        };

        // Process and clean tracks
        const tracks = [];
        for (const item of youtubeTracksData.items) {
          const videoId = item.snippet.resourceId.videoId;

          const videoResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}`,
            {
              headers: { Authorization: `Bearer ${youtubeAccessToken}` },
            }
          );

          if (!videoResponse.ok) {
            console.warn(`Failed to fetch video details for videoId: ${videoId}`);
            continue;
          }

          const videoData = await videoResponse.json();
          const videoSnippet = videoData.items[0]?.snippet;

          if (videoSnippet) {
            const { artist, title } = extractArtistAndTitle(videoSnippet.title);
            tracks.push({
              title: cleanTitle(title),
              artist: cleanArtist(artist || videoSnippet.channelTitle),
            });
          }
        }

        if (tracks.length === 0) {
          console.warn("No valid tracks found in YouTube playlist.");
          return;
        }

        console.log("Processed Tracks:", tracks);

        // 3. Create Spotify playlist with YouTube playlist title
        const spotifyPlaylistId = await createSpotifyPlaylist(spotifyAccessToken, youtubePlaylistTitle);

        // 4. Search Spotify and add tracks
        for (const track of tracks) {
          try {
            const query = `track:${track.title} artist:${track.artist}`;
            console.log("Search Query:", query);

            let spotifyResult = await searchSpotify(query, spotifyAccessToken);

            if (!spotifyResult) {
              console.warn(`No match for "${track.title}" by "${track.artist}". Trying fallback.`);
              const fallbackQuery = `${track.title} ${track.artist}`;
              spotifyResult = await searchSpotify(fallbackQuery, spotifyAccessToken);
            }

            if (spotifyResult && spotifyResult.id) {
              await addTrackToPlaylist(spotifyAccessToken, spotifyPlaylistId, `spotify:track:${spotifyResult.id}`);
              console.log(`Added "${track.title}" to Spotify playlist`);
            } else {
              console.warn(`No match found for "${track.title}" by "${track.artist}"`);
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
