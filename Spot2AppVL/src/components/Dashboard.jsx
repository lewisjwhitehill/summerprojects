import React, { useEffect, useState } from "react";
import Playlists from "./Playlists";  // Import the Playlists component

function Dashboard({ accessToken, onTokenExpired }) {
  const [userInfo, setUserInfo] = useState(null);
  const [topTrack, setTopTrack] = useState(null);

  // Function to check if the token is still valid
  const checkTokenValidity = async () => {
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 401) {
        // If the token is invalid or expired, call the onTokenExpired callback to handle it
        onTokenExpired();
      } else {
        const data = await response.json();
        setUserInfo(data);
      }
    } catch (error) {
      console.error("Error checking token validity:", error);
      onTokenExpired(); // Handle errors by assuming token is expired or invalid
    }
  };

  // Fetch Spotify user profile data
  useEffect(() => {
    if (!accessToken) return;
    checkTokenValidity(); // Check token validity before fetching data
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
          style={{ borderRadius: "50%", width: "30px", height: "30px" }}
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
              style={{ width: "50px", height: "50px", borderRadius: "10px" }}
            />
          )}
        </div>
      )}

      {/* Render Playlists component and pass accessToken as prop */}
      {/* <Playlists accessToken={accessToken} /> */}
    </div>
  );
}

export default Dashboard;
