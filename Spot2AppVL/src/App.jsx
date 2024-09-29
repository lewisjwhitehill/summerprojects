import React, { useState, useEffect } from 'react';
import "./App.css";
import LoginWithSpotify from "./components/LoginWithSpotify";
import LoginWithYoutube from "./components/LoginWithYoutube";
import Dashboard from "./components/Dashboard"; // Spotify Dashboard
import YouTubeDashboard from "./components/YoutubeDashboard"; // YouTube Dashboard

function App() {
  const [fromService, setFromService] = useState(''); // Source service
  const [toService, setToService] = useState(''); // Target service
  const [spotifyAccessToken, setSpotifyAccessToken] = useState(null);
  const [youtubeAccessToken, setYouTubeAccessToken] = useState(null);
  const [fromAccessToken, setFromAccessToken] = useState(null); // Access token for "from" service
  const [toAccessToken, setToAccessToken] = useState(null); // Access token for "to" service

  // Function to save Spotify token and expiration time in localStorage
  const saveSpotifyToken = (token, expiresIn) => {
    const expiryTime = Date.now() + expiresIn * 1000;
    localStorage.setItem("spotifyAccessToken", token);
    localStorage.setItem("spotifyTokenExpiry", expiryTime);
    setSpotifyAccessToken(token);
  };

  // Function to save YouTube token and expiration time in localStorage
  const saveYouTubeToken = (token, expiresIn) => {
    const expiryTime = Date.now() + expiresIn * 1000;
    localStorage.setItem("youtubeAccessToken", token);
    localStorage.setItem("youtubeTokenExpiry", expiryTime);
    setYouTubeAccessToken(token);
  };

  // Check for stored tokens on mount and set state if valid
  useEffect(() => {
    const storedSpotifyToken = localStorage.getItem("spotifyAccessToken");
    const storedSpotifyExpiry = localStorage.getItem("spotifyTokenExpiry");
    if (storedSpotifyToken && storedSpotifyExpiry && Date.now() < storedSpotifyExpiry) {
      setSpotifyAccessToken(storedSpotifyToken);
      setFromService('spotify'); // Automatically load Spotify dashboard
    }

    const storedYouTubeToken = localStorage.getItem("youtubeAccessToken");
    const storedYouTubeExpiry = localStorage.getItem("youtubeTokenExpiry");
    if (storedYouTubeToken && storedYouTubeExpiry && Date.now() < storedYouTubeExpiry) {
      setYouTubeAccessToken(storedYouTubeToken);
      setFromService('youtube'); // Automatically load YouTube dashboard
    }
  }, []);

  // Token checks and URL handling for Spotify and YouTube
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);

    // Handle Spotify Token
    const storedSpotifyToken = localStorage.getItem("spotifyAccessToken");
    const storedSpotifyExpiry = localStorage.getItem("spotifyTokenExpiry");
    if (!storedSpotifyToken || !storedSpotifyExpiry || Date.now() >= storedSpotifyExpiry) {
      // Only handle URL tokens if not found in localStorage
      if (queryParams.has("state") && queryParams.get("state") === "spotify_login") {
        const token = queryParams.get("access_token");
        const expiresIn = queryParams.get("expires_in");

        if (token && expiresIn) {
          setFromAccessToken(token);
          setFromService('spotify'); // Automatically set service
          saveSpotifyToken(token, expiresIn);
          window.history.replaceState({}, document.title, "/");
        }
      }
    }

    // Handle YouTube Token
    const storedYouTubeToken = localStorage.getItem("youtubeAccessToken");
    const storedYouTubeExpiry = localStorage.getItem("youtubeTokenExpiry");
    if (!storedYouTubeToken || !storedYouTubeExpiry || Date.now() >= storedYouTubeExpiry) {
      // Only handle URL tokens if not found in localStorage
      if (queryParams.has("state") && queryParams.get("state") === "youtube_login") {
        const token = queryParams.get("access_token");
        const expiresIn = queryParams.get("expires_in");

        if (token && expiresIn) {
          setFromAccessToken(token);
          setFromService('youtube'); // Automatically set service
          saveYouTubeToken(token, expiresIn);
          window.history.replaceState({}, document.title, "/");
        }
      }
    }
  }, [fromService, toService]);

  // Clear all tokens for debugging and testing
  const clearTokens = () => {
    localStorage.removeItem("spotifyAccessToken");
    localStorage.removeItem("spotifyTokenExpiry");
    localStorage.removeItem("youtubeAccessToken");
    localStorage.removeItem("youtubeTokenExpiry");
    setSpotifyAccessToken(null);
    setYouTubeAccessToken(null);
    setFromAccessToken(null);
    setToAccessToken(null);
    setFromService('');
    setToService('');
  };

  return (
    <div className="app-container">
      {/* Clear Tokens Button for Debugging */}
      <button onClick={clearTokens}>Clear Tokens</button>

      {/* Left Panel: "From" Service */}
      <div className="panel left-panel">
        <h3>Convert From:</h3>
        {fromService === 'spotify' && spotifyAccessToken ? (
          <Dashboard accessToken={spotifyAccessToken} />
        ) : fromService === 'youtube' && youtubeAccessToken ? (
          <YouTubeDashboard accessToken={youtubeAccessToken} />
        ) : (
          <>
            <button onClick={() => setFromService('spotify')}>Spotify</button>
            <button onClick={() => setFromService('youtube')}>YouTube</button>
          </>
        )}
      </div>

      {/* Right Panel: "To" Service */}
      <div className="panel right-panel">
        <h3>Convert To:</h3>
        {toService === 'spotify' && spotifyAccessToken ? (
          <Dashboard accessToken={spotifyAccessToken} />
        ) : toService === 'youtube' && youtubeAccessToken ? (
          <YouTubeDashboard accessToken={youtubeAccessToken} />
        ) : (
          <>
            <button onClick={() => setToService('spotify')}>Spotify</button>
            <button onClick={() => setToService('youtube')}>YouTube</button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
