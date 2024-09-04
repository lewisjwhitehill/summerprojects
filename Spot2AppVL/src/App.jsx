// src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';
import LoginWithSpotify from './components/LoginWithSpotify.jsx'; // Spotify login component
import Dashboard from './components/Dashboard.jsx'; // New Dashboard component
import { useLocation } from 'react-router-dom';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track whether user is logged in
  const [accessToken, setAccessToken] = useState(null); // Store the access token
  const location = useLocation();

  // Check for access token in the URL when the component mounts
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('access_token');
    
    if (token) {
      setAccessToken(token);
      setIsLoggedIn(true); // Set login state to true if token is present
    }
  }, [location]);

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
