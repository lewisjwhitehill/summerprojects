import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const location = useLocation();

  // Function to extract the access token from the URL
  const getAccessToken = () => {
    const params = new URLSearchParams(location.search);
    return params.get("access_token");
  };

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      fetchUserData(token); // Fetch user data with the access token
    }
  }, [location]);

  // Function to fetch user information from Spotify API
  const fetchUserData = async (token) => {
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUserData(data); // Store the data in state
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <div>
      {userData ? (
        <div>
          <h1>Welcome, {userData.display_name}!</h1>
          <img src={userData.images[0]?.url} alt="Profile" />
          <p>Email: {userData.email}</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}

export default Dashboard;
