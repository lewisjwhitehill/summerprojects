import { createYouTubePlaylist, searchYouTube, addVideoToPlaylist } from "../../api /youtubeApi";
function YouTubeAddPlaylist({ playlistId, spotifyAccessToken, youtubeAccessToken }) {
  useEffect(() => {
    const convertPlaylistToYouTube = async () => {
      try {
        // 1. Fetch Spotify tracks
        if (!playlistId || !spotifyAccessToken || !youtubeAccessToken) {
          console.error("Missing playlistId or one of the access tokens.");
          return;
        }

        // Fetch tracks from Spotify
        const spotifyResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          headers: {
            Authorization: `Bearer ${spotifyAccessToken}`,
          },
        });

        if (!spotifyResponse.ok) {
          console.error("Spotify fetch error:", spotifyResponse.status, spotifyResponse.statusText);
          throw new Error("Failed to fetch Spotify tracks");
        }

        const spotifyData = await spotifyResponse.json();
        const tracks = spotifyData.items
          .filter(item => item.track && item.track.artists && item.track.artists.length > 0)
          .map(item => ({
            title: item.track.name,
            artist: item.track.artists[0].name,
          }));

        console.log("Spotify Tracks:", tracks);

        // 2. Create a YouTube playlist
        import { createYouTubePlaylist, searchYouTube, addVideoToPlaylist } from "../utils/youtubeApi";
        const youtubePlaylistId = await createYouTubePlaylist(youtubeAccessToken, "My Converted Playlist");

        // 3. For each track, search YouTube and add to the playlist
        for (const track of tracks) {
          const query = `${track.title} ${track.artist}`;
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
      <h2>Converting Playlist to YouTube...</h2>
    </div>
  );
}

export default YouTubeAddPlaylist;