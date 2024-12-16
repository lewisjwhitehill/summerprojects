import React, { useEffect, useState } from "react";

function YouTubePlaylists({ accessToken, onSelectPlaylist }) {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    if (!accessToken) return;

    const fetchPlaylists = async () => {
      try {
        const response = await fetch(
          "https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&mine=true",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch playlists");
        }

        const data = await response.json();
        setPlaylists(data.items || []); // Set the list of playlists, or an empty array if no items
      } catch (error) {
        console.error("Error fetching YouTube playlists:", error);
      }
    };

    fetchPlaylists();
  }, [accessToken]);

  const handlePlaylistClick = (playlistId) => {
    console.log("YouTube Playlist clicked:", playlistId);
    onSelectPlaylist(playlistId); // Notify parent of selected playlist
  };

  return (
    <div>
      <h2>Your YouTube Playlists</h2>
      {playlists.length === 0 ? (
        <p>No playlists found</p>
      ) : (
        <div>
          {playlists.map((playlist) => (
            <button
              key={playlist.id}
              onClick={() => handlePlaylistClick(playlist.id)}
              style={{ display: "block", margin: "10px 0" }}
            >
              {playlist.snippet.title} ({playlist.contentDetails?.itemCount || 0} videos)
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default YouTubePlaylists;
