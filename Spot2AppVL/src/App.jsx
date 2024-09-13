import React, { useState, useEffect } from "react";
import "./App.css";
import LoginWithSpotify from "./components/LoginWithSpotify.jsx";
import Dashboard from "./components/Dashboard.jsx";

function App() {
  const [accessToken, setAccessToken] = useState(null);

  // Function to set token and expiration time in localStorage
  const saveToken = (token, expiresIn) => {
    const expiryTime = Date.now() + expiresIn * 1000; // Convert expiresIn to milliseconds
    localStorage.setItem("spotifyAccessToken", token);
    localStorage.setItem("spotifyTokenExpiry", expiryTime);
    setAccessToken(token);
  };

  // Check if token exists in URL or localStorage
  useEffect(() => {
    // Check if the token is in URL
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("access_token");
    const expiresIn = queryParams.get("expires_in"); // Assuming the token expiry is passed in the URL as well

    // If token is in URL, save it and clean up the URL
    if (token && expiresIn) {
      saveToken(token, expiresIn);
      window.history.replaceState({}, document.title, "/"); // Clean up the URL
    } else {
      // Check if token exists in localStorage and is still valid
      const storedToken = localStorage.getItem("spotifyAccessToken");
      const storedExpiry = localStorage.getItem("spotifyTokenExpiry");

      if (storedToken && storedExpiry && Date.now() < storedExpiry) {
        setAccessToken(storedToken); // Token is still valid
      } else {
        // If token is expired, clear it from localStorage
        localStorage.removeItem("spotifyAccessToken");
        localStorage.removeItem("spotifyTokenExpiry");
      }
    }
  }, []);

  return (
    <div className="card">
      {accessToken ? (
        <Dashboard accessToken={accessToken} />
      ) : (
        <LoginWithSpotify onLogin={setAccessToken} />
      )}
    </div>
  );
}

export default App;
