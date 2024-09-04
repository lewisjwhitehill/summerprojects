// src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';
import LoginWithSpotify from './components/LoginWithSpotify.jsx'; // Spotify login component
import Dashboard from './components/Dashboard.jsx'; // New Dashboard component

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track whether the user is logged in
  const [accessToken, setAccessToken] = useState(null); // Store the access token

  // Simulating getting the access token from the OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search); // Check the query string for the access token
    const token = params.get('access_token'); // This simulates getting the access token

    if (token) {
      setAccessToken(token);
      setIsLoggedIn(true); // Set login state to true if token is present
    }
  }, []);

  return (
    <div className="App">
      {isLoggedIn ? (
        <Dashboard accessToken={accessToken} /> // Show dashboard after login
      ) : (
        <LoginWithSpotify /> // Show login screen before login
      )}
    </div>
  );
}

export default App;
