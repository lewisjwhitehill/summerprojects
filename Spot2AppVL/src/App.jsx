import React, { useState, useEffect } from "react";
import "./App.css";
import LoginWithSpotify from "./components/LoginWithSpotify";
import LoginWithYoutube from "./components/LoginWithYoutube";
import Dashboard from "./components/Dashboard";
import YouTubeDashboard from "./components/YoutubeDashboard";
import YouTubeAddPlaylist from "./components/YoutubeAddPlaylist";
import SpotifyAddPlaylist from "./components/SpotifyAddPlaylist";
import Playlists from "./components/Playlists";
import YouTubePlaylists from "./components/YouTubePlaylists";

function App() {
  const [fromService, setFromService] = useState("spotify"); // Default to Spotify for debugging
  const [toService, setToService] = useState("youtube"); // Default to YouTube for debugging
  const [fromAccessToken, setFromAccessToken] = useState(null);
  const [toAccessToken, setToAccessToken] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [message, setMessage] = useState("");

  const saveToken = (service, token, expiresIn, context) => {
    const expiryTime = Date.now() + expiresIn * 1000;
    localStorage.setItem(`${context}_${service}AccessToken`, token);
    localStorage.setItem(`${context}_${service}TokenExpiry`, expiryTime);
    if (context === "from") {
      setFromAccessToken(token);
    } else {
      setToAccessToken(token);
    }
  };

  const clearTokens = () => {
    ["spotify", "youtube"].forEach((service) => {
      localStorage.removeItem(`from_${service}AccessToken`);
      localStorage.removeItem(`from_${service}TokenExpiry`);
      localStorage.removeItem(`to_${service}AccessToken`);
      localStorage.removeItem(`to_${service}TokenExpiry`);
    });
    setFromAccessToken(null);
    setToAccessToken(null);
    setSelectedPlaylist(null);
    setMessage("Tokens have been cleared.");
    setTimeout(() => setMessage(""), 3000);
  };

  // Auto-login effect
  useEffect(() => {
    const autoLogin = (service, context, setToken) => {
      const queryParams = new URLSearchParams(window.location.search);
      const token = queryParams.get("access_token");
      const expiresIn = queryParams.get("expires_in");

      if (token && expiresIn) {
        console.log(`[AutoLogin] Saving token for ${context} ${service}`);
        saveToken(service, token, expiresIn, context);
        window.history.replaceState({}, document.title, "/");
      } else {
        const storedToken = localStorage.getItem(`${context}_${service}AccessToken`);
        const storedExpiry = localStorage.getItem(`${context}_${service}TokenExpiry`);
        if (storedToken && storedExpiry && Date.now() < storedExpiry) {
          console.log(`[AutoLogin] Using stored token for ${context} ${service}`);
          setToken(storedToken);
        } else {
          console.log(`[AutoLogin] No valid token found for ${context} ${service}`);
        }
      }
    };

    if (fromService) autoLogin(fromService, "from", setFromAccessToken);
    if (toService) autoLogin(toService, "to", setToAccessToken);
  }, [fromService, toService]);

  const handlePlaylistSelection = (playlistId) => {
    setSelectedPlaylist(playlistId);
    console.log("Selected Playlist ID:", playlistId);
  };

  const renderConversionComponent = () => {
    if (!selectedPlaylist || !(fromService && toService && fromAccessToken && toAccessToken)) {
      return <p>Please log in to both services to proceed.</p>;
    }

    if (fromService === "spotify" && toService === "youtube") {
      return (
        <YouTubeAddPlaylist
          playlistId={selectedPlaylist}
          spotifyAccessToken={fromAccessToken}
          youtubeAccessToken={toAccessToken}
        />
      );
    } else if (fromService === "youtube" && toService === "spotify") {
      return (
        <SpotifyAddPlaylist
          playlistId={selectedPlaylist}
          youtubeAccessToken={fromAccessToken}
          spotifyAccessToken={toAccessToken}
        />
      );
    }
    return null;
  };

  return (
    <div className="app-container">
      <div>
        {message && <p>{message}</p>}
        <button onClick={clearTokens}>Clear Tokens</button>
      </div>

      {/* Left Panel */}
      <div className="panel left-panel">
        <h3>Convert From:</h3>
        <button onClick={() => setFromService("spotify")}>Spotify</button>
        <button onClick={() => setFromService("youtube")}>YouTube</button>

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
            <YouTubePlaylists accessToken={fromAccessToken} onSelectPlaylist={handlePlaylistSelection} />
          </>
        ) : (
          fromService === "youtube" && <LoginWithYoutube />
        )}
      </div>

      {/* Right Panel */}
      <div className="panel right-panel">
        <h3>Convert To:</h3>
        <button onClick={() => setToService("spotify")}>Spotify</button>
        <button onClick={() => setToService("youtube")}>YouTube</button>

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

      {/* Conversion Component */}
      <div className="conversion-component">
        {renderConversionComponent()}
      </div>
    </div>
  );
}

export default App;
