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

  // Token checks and URL handling for Spotify and YouTube (similar to your original setup)
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    
    // Spotify Token Handling
    const spotifyToken = queryParams.get("access_token");
    const spotifyExpiresIn = queryParams.get("expires_in");
    if (spotifyToken && spotifyExpiresIn) {
      saveSpotifyToken(spotifyToken, spotifyExpiresIn);
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

    // YouTube Token Handling
    const youtubeToken = queryParams.get("access_token");
    const youtubeExpiresIn = queryParams.get("expires_in");
    if (youtubeToken && youtubeExpiresIn) {
      saveYouTubeToken(youtubeToken, youtubeExpiresIn);
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
  }, []);

  return (
    <div className="app-container">
      {/* Left Panel: "From" Service */}
      <div className="panel left-panel">
        <h3>Convert From:</h3>
        <button onClick={() => setFromService('spotify')}>Spotify</button>
        <button onClick={() => setFromService('youtube')}>YouTube</button>

        {fromService === 'spotify' && (
          spotifyAccessToken ? (
            <Dashboard accessToken={spotifyAccessToken} />
          ) : (
            <LoginWithSpotify onLogin={saveSpotifyToken} />
          )
        )}

        {fromService === 'youtube' && (
          youtubeAccessToken ? (
            <YouTubeDashboard accessToken={youtubeAccessToken} />
          ) : (
            <LoginWithYoutube onLogin={saveYouTubeToken} />
          )
        )}
      </div>

      {/* Right Panel: "To" Service */}
      <div className="panel right-panel">
        <h3>Convert To:</h3>
        <button onClick={() => setToService('spotify')}>Spotify</button>
        <button onClick={() => setToService('youtube')}>YouTube</button>

        {toService === 'spotify' && (
          spotifyAccessToken ? (
            <Dashboard accessToken={spotifyAccessToken} />
          ) : (
            <LoginWithSpotify onLogin={saveSpotifyToken} />
          )
        )}

        {toService === 'youtube' && (
          youtubeAccessToken ? (
            <YouTubeDashboard accessToken={youtubeAccessToken} />
          ) : (
            <LoginWithYoutube onLogin={saveYouTubeToken} />
          )
        )}
      </div>
    </div>
  );
}

export default App;
