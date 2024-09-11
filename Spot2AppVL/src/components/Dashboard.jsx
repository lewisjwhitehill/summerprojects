import React, { useEffect, useState } from "react";

function Dashboard({ accessToken }) {
  const [userInfo, setUserInfo] = useState(null);
  const [topTracks, setTopTracks] = useState([]);

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

  // Fetch user's top tracks
  useEffect(() => {
    if (!accessToken) return;

    const fetchTopTracks = async () => {
      const response = await fetch(
        "https://api.spotify.com/v1/me/top/tracks?limit=5", // Fetch top 5 tracks
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      setTopTracks(data.items || []);
    };

    fetchTopTracks();
  }, [accessToken]);

  if (!userInfo) {
    return <div>Loading Dashboard...</div>; // Show loading until data is fetched
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome, {userInfo.display_name}</h1>
      <img
        src={userInfo.images[0]?.url}
        alt={`${userInfo.display_name}'s profile`}
        style={{ borderRadius: "50%", width: "150px", height: "150px" }}
      />
      <h2>Your Top 5 Tracks</h2>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {topTracks.map((track, index) => (
          <li key={track.id}>
            <strong>{index + 1}. {track.name}</strong> by {track.artists.map(artist => artist.name).join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
