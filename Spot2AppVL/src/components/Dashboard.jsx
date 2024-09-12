import React, { useEffect, useState } from "react";
import Playlists from "./Playlists";  // Import the Playlists component

function Dashboard({ accessToken }) {
  const [userInfo, setUserInfo] = useState(null);
  const [topTrack, setTopTrack] = useState(null);

  // Fetch Spotify user profile data
  useEffect(() => {
    if (!accessToken) return;

    const fetchUserInfo = async () => {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setUserInfo(data);
    };

    fetchUserInfo();
  }, [accessToken]);

  // Fetch user's top track
  useEffect(() => {
    if (!accessToken) return;

    const fetchTopTrack = async () => {
      const response = await fetch(
        "https://api.spotify.com/v1/me/top/tracks?limit=1&time_range=long_term", 
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      setTopTrack(data.items[0]); // Get the top track
    };

    fetchTopTrack();
  }, [accessToken]);

  if (!userInfo) {
    return <div>Loading...</div>; // Show loading message while data is being fetched
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome, {userInfo.display_name}</h1>
      {userInfo.images.length > 0 && (
        <img
          src={userInfo.images[0].url}
          alt="Profile"
          style={{ borderRadius: "50%", width: "150px", height: "150px" }}
        />
      )}

      {topTrack && (
        <div style={{ marginTop: "20px" }}>
          <h2>Your Most Listened To Song</h2>
          <h3>{topTrack.name}</h3>
          <p>{topTrack.artists.map(artist => artist.name).join(", ")}</p>
          {topTrack.album.images.length > 0 && (
            <img
              src={topTrack.album.images[0].url}
              alt={topTrack.name}
              style={{ width: "20px", height: "20px", borderRadius: "10px" }}
            />
          )}
        </div>
      )}

      {/* Render Playlists component and pass accessToken as prop */}
      <Playlists accessToken={accessToken} />
    </div>
  );
}

export default Dashboard;
