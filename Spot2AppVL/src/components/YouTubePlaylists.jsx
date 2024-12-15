import React, { useState, useEffect } from 'react';

const YouTubePlaylists = ({ accessToken }) => {
  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await fetch(`/api/fetchYouTubePlaylists?access_token=${accessToken}`);
        const data = await response.json();

        if (data.playlists) {
          setPlaylists(data.playlists);
          setError(null);
        } else {
          setError(data.error || "Failed to fetch playlists.");
        }
      } catch (err) {
        console.error("Error fetching YouTube playlists:", err);
        setError("An error occurred while fetching playlists.");
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchPlaylists();
    }
  }, [accessToken]);

  if (loading) return <p>Loading playlists...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Your YouTube Playlists</h2>
      {playlists.length > 0 ? (
        <div>
          {playlists.map((playlist) => (
            <button
              key={playlist.id}
              onClick={() => console.log(`Selected Playlist ID: ${playlist.id}`)}
              style={{
                display: "block",
                margin: "10px 0",
                padding: "10px",
                backgroundColor: "#1DB954",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                textAlign: "left",
                width: "100%",
              }}
            >
              {playlist.snippet.title}
            </button>
          ))}
        </div>
      ) : (
        <p>No playlists found.</p>
      )}
    </div>
  );
};

export default YouTubePlaylists;
