import React, { useState, useEffect } from 'react';
import YouTubePlaylists from './YouTubePlaylists';

const YouTubeDashboard = ({ accessToken }) => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    // Fetch YouTube playlists on component mount
    const fetchPlaylists = async () => {
      try {
        const response = await fetch(`/api/fetchYouTubePlaylists?access_token=${accessToken}`);
        const data = await response.json();

        if (data.playlists) {
          setPlaylists(data.playlists);
        }
      } catch (error) {
        console.error('Error fetching YouTube playlists:', error);
      }
    };

    if (accessToken) {
      fetchPlaylists();
    }
  }, [accessToken]);

  return (
    <div>
      <h2>YouTube Dashboard</h2>
      {/* Render the YouTubePlaylists component */}
      <YouTubePlaylists playlists={playlists} />
    </div>
  );
};

export default YouTubeDashboard;
