import React, { useEffect, useState } from 'react';

const YouTubePlaylists = ({ accessToken }) => {
  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await fetch(`/api/fetchYouTubePlaylists?access_token=${accessToken}`);
        const data = await response.json();

        if (data.playlists) {
          setPlaylists(data.playlists);
        } else {
          setError('Failed to fetch playlists.');
        }
      } catch (error) {
        console.error('Error fetching YouTube playlists:', error);
        setError('An error occurred while fetching playlists.');
      }
    };

    // Fetch playlists when access token is available
    if (accessToken) {
      fetchPlaylists();
    }
  }, [accessToken]);

  return (
    <div>
      <h2>Your YouTube Playlists</h2>
      {error && <p>{error}</p>}
      <ul>
        {playlists.map((playlist) => (
          <li key={playlist.id}>{playlist.snippet.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default YouTubePlaylists;
