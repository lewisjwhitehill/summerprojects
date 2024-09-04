// src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react';

function Dashboard({ accessToken }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (accessToken) {
      fetchUserData();
    }
  }, [accessToken]);

  return (
    <div>
      <h1>Spotify Dashboard</h1>
      {userData ? (
        <div>
          <h2>Welcome, {userData.display_name}</h2>
          <p>Email: {userData.email}</p>
          <p>Country: {userData.country}</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}

export default Dashboard;
