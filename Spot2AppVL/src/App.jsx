import React, { useState, useEffect } from 'react';
import "./App.css";
import LoginWithSpotify from "./components/LoginWithSpotify";
import LoginWithYoutube from "./components/LoginWithYoutube";
import Dashboard from "./components/Dashboard"; // Spotify Dashboard
import YouTubeDashboard from "./components/YouTubeDashboard"; // YouTube Dashboard

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

  // Handle "from" service token separately
  useEffect(() => {
    if (!fromService) return;

    const queryParams = new URLSearchParams(window.location.search);

    // Handle Spotify Token for "from" service
    if (fromService === 'spotify') {
      const token = queryParams.get("access_token");
      const expiresIn = queryParams.get("expires_in");

      if (token && expiresIn) {
        setFromAccessToken(token);
        saveSpotifyToken(token, expiresIn);
        window.history.replaceState({}, document.title, "/");
      } else {
        const storedSpotifyToken = localStorage.getItem("spotifyAccessToken");
        const storedSpotifyExpiry = localStorage.getItem("spotifyTokenExpiry");
        if (storedSpotifyToken && storedSpotifyExpiry && Date.now() < storedSpotifyExpiry) {
          setSpotifyAccessToken(storedSpotifyToken);
        } else {
          localStorage.removeItem("spotifyAccessToken");
          localStorage.removeItem("spotifyTokenExpiry");
        }
      }
    }

    // Handle YouTube Token for "from" service
    if (fromService === 'youtube') {
      const token = queryParams.get("access_token");
      const expiresIn = queryParams.get("expires_in");

      if (token && expiresIn) {
        setFromAccessToken(token);
        saveYouTubeToken(token, expiresIn);
        window.history.replaceState({}, document.title, "/");
      } else {
        const storedYouTubeToken = localStorage.getItem("youtubeAccessToken");
        const storedYouTubeExpiry = localStorage.getItem("youtubeTokenExpiry");
        if (storedYouTubeToken && storedYouTubeExpiry && Date.now() < storedYouTubeExpiry) {
          setYouTubeAccessToken(storedYouTubeToken);
        } else {
          localStorage.removeItem("youtubeAccessToken");
          localStorage.removeItem("youtubeTokenExpiry");
        }
      }
    }
  }, [fromService]);

  // Handle "to" service token separately
  useEffect(() => {
    if (!toService) return;

    const queryParams = new URLSearchParams(window.location.search);

    // Handle Spotify Token for "to" service
    if (toService === 'spotify') {
      const token = queryParams.get("access_token");
      const expiresIn = queryParams.get("expires_in");

      if (token && expiresIn) {
        setToAccessToken(token);
        saveSpotifyToken(token, expiresIn);
        window.history.replaceState({}, document.title, "/");
      } else {
        const storedSpotifyToken = localStorage.getItem("spotifyAccessToken");
        const storedSpotifyExpiry = localStorage.getItem("spotifyTokenExpiry");
        if (storedSpotifyToken && storedSpotifyExpiry && Date.now() < storedSpotifyExpiry) {
          setSpotifyAccessToken(storedSpotifyToken);
        } else {
          localStorage.removeItem("spotifyAccessToken");
          localStorage.removeItem("spotifyTokenExpiry");
        }
      }
    }

    // Handle YouTube Token for "to" service
    if (toService === 'youtube') {
      const token = queryParams.get("access_token");
      const expiresIn = queryParams.get("expires_in");

      if (token && expiresIn) {
        setToAccessToken(token);
        saveYouTubeToken(token, expiresIn);
        window.history.replaceState({}, document.title, "/");
      } else {
        const storedYouTubeToken = localStorage.getItem("youtubeAccessToken");
        const storedYouTubeExpiry = localStorage.getItem("youtubeTokenExpiry");
        if (storedYouTubeToken && storedYouTubeExpiry && Date.now() < storedYouTubeExpiry) {
          setYouTubeAccessToken(storedYouTubeToken);
        } else {
          localStorage.removeItem("youtubeAccessToken");
          localStorage.removeItem("youtubeTokenExpiry");
        }
      }
    }
  }, [toService]);

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
  };

  return (
    <div className="app-container">
      {/* Clear Tokens Button for Debugging */}
      <div> 
        <button onClick={clearTokens}>Clear Tokens</button>
      </div>

      {/* Left Panel: "From" Service */}
      <div className="panel left-panel">
        <h3>Convert From:</h3>
        <button onClick={() => setFromService('spotify')}>Spotify</button>
        <button onClick={() => setFromService('youtube')}>YouTube</button>

        {fromService === 'spotify' && (
          fromAccessToken ? (
            <Dashboard accessToken={fromAccessToken} onTokenExpired={clearTokens} />
          ) : (
            <LoginWithSpotify onLogin={(token, expiresIn) => setFromAccessToken(token)} />
          )
        )}

        {fromService === 'youtube' && (
          fromAccessToken ? (
            <YouTubeDashboard accessToken={fromAccessToken} onTokenExpired={clearTokens} />
          ) : (
            <LoginWithYoutube onLogin={(token, expiresIn) => setFromAccessToken(token)} />
          )
        )}
      </div>

      {/* Right Panel: "To" Service */}
      <div className="panel right-panel">
        <h3>Convert To:</h3>
        <button onClick={() => setToService('spotify')}>Spotify</button>
        <button onClick={() => setToService('youtube')}>YouTube</button>

        {toService === 'spotify' && (
          toAccessToken ? (
            <Dashboard accessToken={toAccessToken} />
          ) : (
            <LoginWithSpotify onLogin={(token, expiresIn) => setToAccessToken(token)} />
          )
        )}

        {toService === 'youtube' && (
          toAccessToken ? (
            <YouTubeDashboard accessToken={toAccessToken} />
          ) : (
            <LoginWithYoutube onLogin={(token, expiresIn) => setToAccessToken(token)} />
          )
        )}
      </div>

      {/* Debugging Section */}
      <div className="token-debug" style={{ marginTop: "20px", padding: "10px", backgroundColor: "#f1f1f1", textAlign: "center" }}>
        <h4>Debugging Info</h4>
        <p><strong>Spotify Access Token (From):</strong> {fromAccessToken || "Not Set"}</p>
        <p><strong>Spotify Access Token (To):</strong> {toAccessToken || "Not Set"}</p>
        <p><strong>YouTube Access Token (From):</strong> {fromAccessToken || "Not Set"}</p>
        <p><strong>YouTube Access Token (To):</strong> {toAccessToken || "Not Set"}</p>
      </div>
    </div>
  );
}

export default App;
