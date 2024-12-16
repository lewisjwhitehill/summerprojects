import React, { useEffect, useState } from "react";
import YouTubePlaylists from "./YouTubePlaylists"; // Correctly import YouTubePlaylists

function YouTubeDashboard({ accessToken, onTokenExpired }) {
  const [userInfo, setUserInfo] = useState(null); // Similar to Spotify's userInfo
  const [topVideo, setTopVideo] = useState(null);

  // Function to check if the token is still valid
  const checkTokenValidity = async () => {
    try {
      const response = await fetch("https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 401) {
        onTokenExpired(); // If token is invalid or expired
      } else {
        const data = await response.json();
        setUserInfo(data.items[0]); // Set YouTube user info
      }
    } catch (error) {
      console.error("Error checking token validity:", error);
      onTokenExpired();
    }
  };

  useEffect(() => {
    if (!accessToken) return;
    checkTokenValidity();
  }, [accessToken]);

  if (!userInfo) {
    return <div>Loading...</div>; // Show loading message while data is being fetched
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to your YouTube Channel, {userInfo.snippet.title}</h1>
      {userInfo.snippet.thumbnails?.default?.url && (
        <img
          src={userInfo.snippet.thumbnails.default.url}
          alt="Channel Thumbnail"
          style={{ borderRadius: "50%", width: "50px", height: "50px" }}
        />
      )}

      {topVideo && (
        <div style={{ marginTop: "20px" }}>
          <h2>Your Top Liked Video</h2>
          <h3>{topVideo.snippet.title}</h3>
          <p>Published on: {new Date(topVideo.snippet.publishedAt).toLocaleDateString()}</p>
          {topVideo.snippet.thumbnails?.default?.url && (
            <img
              src={topVideo.snippet.thumbnails.default.url}
              alt={topVideo.snippet.title}
              style={{ width: "100px", height: "100px", borderRadius: "10px" }}
            />
          )}
        </div>
      )}

      {/* Replace Playlists with YouTubePlaylists */}
      {/* <YouTubePlaylists accessToken={accessToken} /> */}
    </div>
  );
}

export default YouTubeDashboard;
