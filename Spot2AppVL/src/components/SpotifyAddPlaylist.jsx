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

        // Fetch playlist items from YouTube
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

        const cleanTitle = (title) => title.replace(/\(.*?\)|\[.*?\]/g, "").trim(); // Remove extra text
        const cleanArtist = (artist) => artist.replace(/\s-\sTopic$/i, "").trim(); // Remove "- Topic" suffix

        const extractArtistAndTitle = (title) => {
          const match = title.match(/^(.*?)\s-\s(.*)$/);
          if (match) {
            return { artist: match[1].trim(), title: match[2].trim() };
          }
          return { artist: null, title: title.trim() };
        };

        // Retrieve enhanced metadata using videoId
        const tracks = [];
        for (const item of youtubeData.items) {
          const videoId = item.snippet.resourceId.videoId;

          // Fetch detailed video metadata
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
              title: cleanTitle(title), // Clean title
              artist: cleanArtist(artist || videoSnippet.channelTitle), // Clean artist and fallback
            });
          }
        }

        if (tracks.length === 0) {
          console.warn("No valid tracks found in YouTube playlist.");
          return;
        }

        console.log("Processed Tracks:", tracks);

        // Create Spotify playlist
        const spotifyPlaylistId = await createSpotifyPlaylist(spotifyAccessToken, "My Converted Playlist");

        // Search Spotify and add tracks
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
