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
              <ul>
                  {playlists.map((playlist) => (
                      <li key={playlist.id}>{playlist.snippet.title}</li>
                  ))}
              </ul>
          ) : (
              <p>No playlists found.</p>
          )}
      </div>
  );
};
export default YouTubePlaylists;
