import React, { useEffect, useState } from "react";

function Dashboard({ accessToken }) {
  const [userInfo, setUserInfo] = useState(null);

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
    </div>
  );
}

export default Dashboard;
