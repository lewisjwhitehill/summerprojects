import React, { useEffect, useState } from "react";

function Dashboard({ accessToken }) {
  const [currentTrack, setCurrentTrack] = useState(null);

  // Fetch the currently playing track
  useEffect(() => {
    if (!accessToken) return;

    const fetchCurrentlyPlaying = async () => {
      const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 204 || response.status > 400) {
        // No song is currently playing
        setCurrentTrack(null);
        return;
      }

      const data = await response.json();
      setCurrentTrack(data);
    };

    fetchCurrentlyPlaying();
  }, [accessToken]);

  if (!currentTrack) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>No song is currently being played</h1>
      </div>
    );
  }

  const { item: track } = currentTrack;

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Now Playing</h1>
      <h2>{track.name}</h2>
      <p>
        {track.artists.map(artist => artist.name).join(", ")}
      </p>
      {track.album.images.length > 0 && (
        <img
          src={track.album.images[0].url}
          alt={track.name}
          style={{ width: "200px", height: "200px", borderRadius: "10px" }}
        />
      )}
    </div>
  );
}

export default Dashboard;
