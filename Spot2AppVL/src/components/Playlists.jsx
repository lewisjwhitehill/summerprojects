import React, { useEffect, useState } from "react";

function Playlists({ accessToken }) {
  const [playlists, setPlaylists] = useState([]);

  // Fetch user's playlists using useEffect
  useEffect(() => {
    if (!accessToken) return;

    const fetchPlaylists = async () => {
      try {
        const response = await fetch("https://api.spotify.com/v1/me/playlists", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch playlists");
        }

        const data = await response.json();
        setPlaylists(data.items); // Set the list of playlists
      } catch (error) {
        console.error("Error fetching playlists:", error);
      }
    };

    fetchPlaylists();
  }, [accessToken]); // Re-run the effect when the accessToken changes

  // Function to handle click on a playlist button
  const handlePlaylistClick = (playlistId) => {
    // Implement what should happen when a playlist is clicked
    console.log("Playlist clicked:", playlistId);
    // For example, navigate to a playlist page or start playing the playlist
  };

  // Render the playlists as buttons
  return (
    <div>
      <h2>Your Playlists</h2>
      {playlists.length === 0 ? (
        <p>No playlists found</p>
      ) : (
        <div>
          {playlists.map((playlist) => (
            <button
              key={playlist.id}
              onClick={() => handlePlaylistClick(playlist.id)}
              style={{ display: "block", margin: "10px 0" }} // Optional styling
            >
              {playlist.name} ({playlist.tracks.total} tracks)
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Playlists;
