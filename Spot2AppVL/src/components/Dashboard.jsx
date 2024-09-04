// src/components/Dashboard.jsx
import React, { useEffect, useState } from "react";

function Dashboard({ accessToken }) {
  const [userData, setUserData] = useState(null);

  // Fetch user data from Spotify using the access token
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data); // Store the user data
        } else {
          console.error("Failed to fetch user data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [accessToken]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Spotify Dashboard</h1>
      {userData ? (
        <div>
          <h2>Welcome, {userData.display_name}</h2>
          <p>Email: {userData.email}</p>
          <p>Country: {userData.country}</p>
          {userData.images && userData.images.length > 0 && (
            <img
              src={userData.images[0].url}
              alt="Profile"
              style={{ borderRadius: "50%", width: "150px", height: "150px" }}
            />
          )}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}

export default Dashboard;
