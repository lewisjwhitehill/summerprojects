import React, { useState, useEffect } from "react";
import "./App.css";
import LoginWithSpotify from "./components/LoginWithSpotify";
import LoginWithYoutube from "./components/LoginWithYoutube";
import Dashboard from "./components/Dashboard";
import YouTubeDashboard from "./components/YoutubeDashboard";
import YouTubeAddPlaylist from "./components/YoutubeAddPlaylist";
import Playlists from "./components/Playlists";

function App() {
  const [fromService, setFromService] = useState(""); // Source service
  const [toService, setToService] = useState(""); // Target service
  const [fromAccessToken, setFromAccessToken] = useState(null);
  const [toAccessToken, setToAccessToken] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [message, setMessage] = useState("");

  // Function to save tokens properly
  const saveToken = (service, token, expiresIn, context) => {
    const expiryTime = Date.now() + expiresIn * 1000;
    localStorage.setItem(`${context}_${service}AccessToken`, token);
    localStorage.setItem(`${context}_${service}TokenExpiry`, expiryTime.toString());

    if (context === "from") {
      setFromAccessToken(token);
      setFromService(service);
    } else {
      setToAccessToken(token);
      setToService(service);
    }
  };

  // Handle OAuth callback and restore tokens
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("access_token");
    const expiresIn = queryParams.get("expires_in");
    const service = queryParams.get("service"); // "spotify" or "youtube"
    const context = queryParams.get("context"); // "from" or "to"

    if (token && expiresIn && service && context) {
      saveToken(service, token, parseInt(expiresIn), context);
      window.history.replaceState({}, document.title, "/"); // Clean up URL
    }

    ["spotify", "youtube"].forEach((service) => {
      const fromToken = localStorage.getItem(`from_${service}AccessToken`);
      const fromExpiry = parseInt(localStorage.getItem(`from_${service}TokenExpiry`)) || 0;
      if (fromToken && Date.now() < fromExpiry) {
        setFromAccessToken(fromToken);
        setFromService(service);
      }

      const toToken = localStorage.getItem(`to_${service}AccessToken`);
      const toExpiry = parseInt(localStorage.getItem(`to_${service}TokenExpiry`)) || 0;
      if (toToken && Date.now() < toExpiry) {
        setToAccessToken(toToken);
        setToService(service);
      }
    });
  }, []);

  // Function to clear tokens
  const clearTokens = () => {
    ["spotify", "youtube"].forEach((service) => {
      localStorage.removeItem(`from_${service}AccessToken`);
      localStorage.removeItem(`from_${service}TokenExpiry`);
      localStorage.removeItem(`to_${service}AccessToken`);
      localStorage.removeItem(`to_${service}TokenExpiry`);
    });

    setFromAccessToken(null);
    setToAccessToken(null);
    setFromService("");
    setToService("");
    setSelectedPlaylist(null);
    setMessage("Tokens have been cleared.");
    setTimeout(() => setMessage(""), 3000);
  };

  const handlePlaylistSelection = (playlistId) => {
    setSelectedPlaylist(playlistId);
    console.log("Selected Playlist ID:", playlistId);
  };

  // Determine which conversion component to render
  const renderConversionComponent = () => {
    if (fromService === "spotify" && toService === "youtube") {
      return (
        <YouTubeAddPlaylist
          playlistId={selectedPlaylist}
          spotifyAccessToken={fromAccessToken}
          youtubeAccessToken={toAccessToken}
        />
      );
    }
    return null;
  };

  return (
    <div className="app-container">
      <div className="banner">Playlist Converter</div>
      <div>
        {message && <p>{message}</p>}
        <button className="floating-clear-tokens" onClick={clearTokens}>
          Clear Tokens
        </button>
      </div>

      <div className="panels-container">
        {/* Left Panel: "From" Service */}
        <div className={`panel left-panel ${fromService}`}>
          {!fromAccessToken && (
            <>
              <h3>Convert From:</h3>
              <button onClick={() => setFromService("spotify")}>Spotify</button>
              <button onClick={() => setFromService("youtube")}>YouTube</button>
            </>
          )}

          {fromService === "spotify" && fromAccessToken ? (
            <>
              <Dashboard accessToken={fromAccessToken} onTokenExpired={clearTokens} />
              <Playlists accessToken={fromAccessToken} onSelectPlaylist={handlePlaylistSelection} />
            </>
          ) : (
            fromService === "spotify" && <LoginWithSpotify />
          )}

          {fromService === "youtube" && fromAccessToken ? (
            <>
              <YouTubeDashboard accessToken={fromAccessToken} />
            </>
          ) : (
            fromService === "youtube" && <LoginWithYoutube />
          )}
        </div>

        {/* Right Panel: "To" Service */}
        <div className={`panel right-panel ${toService}`}>
          {!toAccessToken && (
            <>
              <h3>Convert To:</h3>
              <button onClick={() => setToService("spotify")}>Spotify</button>
              <button onClick={() => setToService("youtube")}>YouTube</button>
            </>
          )}

          {toService === "spotify" && toAccessToken ? (
            <Dashboard accessToken={toAccessToken} />
          ) : (
            toService === "spotify" && <LoginWithSpotify />
          )}

          {toService === "youtube" && toAccessToken ? (
            <YouTubeDashboard accessToken={toAccessToken} />
          ) : (
            toService === "youtube" && <LoginWithYoutube />
          )}
        </div>
      </div>

      <div className="conversion-component">{renderConversionComponent()}</div>
    </div>
  );
}

export default App;
