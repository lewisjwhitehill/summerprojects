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

  // Render the playlists
  return (
    <div>
      <h2>Your Playlists</h2>
      {playlists.length === 0 ? (
        <p>No playlists found</p>
      ) : (
        <ul>
          {playlists.map((playlist) => (
            <li key={playlist.id}>
              {playlist.name} ({playlist.tracks.total} tracks)
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Playlists;
