// src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function Dashboard() {
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    // Extract access_token from the query parameter
    const params = new URLSearchParams(location.search);
    const token = params.get('access_token');
    setAccessToken(token);

    // Fetch user data using the access token
    const fetchUserData = async () => {
      if (!token) return;

      try {
        const response = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchUserData();
  }, [location]);

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
