import React, { useEffect, useState } from "react";
import Playlists from "./Playlists"; // Assuming this component works for YouTube playlists as well

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
        // If the token is invalid or expired, call the onTokenExpired callback to handle it
        onTokenExpired();
      } else {
        const data = await response.json();
        setUserInfo(data.items[0]); // Set YouTube user info
      }
    } catch (error) {
      console.error("Error checking token validity:", error);
      onTokenExpired(); // Handle errors by assuming token is expired or invalid
    }
  };

  // Fetch YouTube channel profile data
  useEffect(() => {
    if (!accessToken) return;
    checkTokenValidity(); // Check token validity before fetching data
  }, [accessToken]);

  // Fetch user's top video (example: most liked video)
  useEffect(() => {
    if (!accessToken) return;

    const fetchTopVideo = async () => {
      try {
        const response = await fetch(
          "https://www.googleapis.com/youtube/v3/videos?part=snippet&myRating=like&maxResults=1", // Example: fetching liked videos
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const data = await response.json();
        setTopVideo(data.items[0]); // Get the top liked video
      } catch (error) {
        console.error("Error fetching top video:", error);
      }
    };

    fetchTopVideo();
  }, [accessToken]);

  if (!userInfo) {
    return <div>Loading...</div>; // Show loading message while data is being fetched
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to your YouTube Channel, {userInfo.snippet.title}</h1>
      {userInfo.snippet.thumbnails.default.url && (
        <img
          src={userInfo.snippet.thumbnails.default.url}
          alt="Channel Thumbnail"
          style={{ borderRadius: "50%", width: "30px", height: "30px" }}
        />
      )}

      {topVideo && (
        <div style={{ marginTop: "20px" }}>
          <h2>Your Top Liked Video</h2>
          <h3>{topVideo.snippet.title}</h3>
          <p>Published on: {new Date(topVideo.snippet.publishedAt).toLocaleDateString()}</p>
          {topVideo.snippet.thumbnails.default.url && (
            <img
              src={topVideo.snippet.thumbnails.default.url}
              alt={topVideo.snippet.title}
              style={{ width: "50px", height: "50px", borderRadius: "10px" }}
            />
          )}
        </div>
      )}

      {/* Render Playlists component and pass accessToken as prop */}
      <Playlists accessToken={accessToken} />
    </div>
  );
}

export default YouTubeDashboard;
