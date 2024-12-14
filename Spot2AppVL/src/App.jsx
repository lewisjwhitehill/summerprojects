import React, { useState, useEffect } from "react";
import "./App.css";
import LoginWithSpotify from "./components/LoginWithSpotify";
import LoginWithYoutube from "./components/LoginWithYoutube";
import Dashboard from "./components/Dashboard"; // Spotify Dashboard
import YouTubeDashboard from "./components/YoutubeDashboard"; // YouTube Dashboard
import YouTubeAddPlaylist from "./components/YoutubeAddPlaylist";
import SpotifyAddPlaylist from "./components/SpotifyAddPlaylist";
import Playlists from "./components/Playlists";

function App() {
  const [fromService, setFromService] = useState(""); // Source service
  const [toService, setToService] = useState(""); // Target service
  const [fromAccessToken, setFromAccessToken] = useState(null); // Access token for "from" service
  const [toAccessToken, setToAccessToken] = useState(null); // Access token for "to" service
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [message, setMessage] = useState("");

  const isReadyForConversion =
    fromService && toService && selectedPlaylist && fromAccessToken && toAccessToken;

  // Save access token and expiry to localStorage
  const saveToken = (service, token, expiresIn, context) => {
    const expiryTime = Date.now() + expiresIn * 1000;
    localStorage.setItem(`${context}_${service}AccessToken`, token);
    localStorage.setItem(`${context}_${service}TokenExpiry`, expiryTime);
    if (context === "from") setFromAccessToken(token);
    else setToAccessToken(token);
  };

  // Function to handle service selection and persist it
  const selectService = (service, context) => {
    if (context === "from") {
      setFromService(service);
      localStorage.setItem("fromService", service);
    } else if (context === "to") {
      setToService(service);
      localStorage.setItem("toService", service);
    }
  };

  // Handle playlist selection
  const handlePlaylistSelection = (playlistId) => {
    setSelectedPlaylist(playlistId);
    console.log("Selected Playlist ID:", playlistId);
  };

  // Clear all tokens
  const clearTokens = () => {
    ["spotify", "youtube"].forEach((service) => {
      localStorage.removeItem(`${service}AccessToken`);
      localStorage.removeItem(`${service}TokenExpiry`);
      localStorage.removeItem(`from_${service}AccessToken`);
      localStorage.removeItem(`from_${service}TokenExpiry`);
      localStorage.removeItem(`to_${service}AccessToken`);
      localStorage.removeItem(`to_${service}TokenExpiry`);
    });
    localStorage.removeItem("fromService");
    localStorage.removeItem("toService");

    setFromAccessToken(null);
    setToAccessToken(null);
    setFromService("");
    setToService("");
    setSelectedPlaylist(null);
    setMessage("Tokens have been cleared.");
    setTimeout(() => setMessage(""), 3000);
  };

  // Automatically retrieve tokens and services from localStorage
  useEffect(() => {
    const handleToken = (service, context, setToken) => {
      const storedToken = localStorage.getItem(`${context}_${service}AccessToken`);
      const storedExpiry = localStorage.getItem(`${context}_${service}TokenExpiry`);

      if (storedToken && storedExpiry && Date.now() < storedExpiry) {
        setToken(storedToken); // Set the token in state if valid
      } else {
        localStorage.removeItem(`${context}_${service}AccessToken`);
        localStorage.removeItem(`${context}_${service}TokenExpiry`);
      }
    };

    // Check "from" service token
    if (fromService) {
      handleToken(fromService, "from", setFromAccessToken);
    } else {
      const storedFromService = localStorage.getItem("fromService");
      if (storedFromService) setFromService(storedFromService);
    }

    // Check "to" service token
    if (toService) {
      handleToken(toService, "to", setToAccessToken);
    } else {
      const storedToService = localStorage.getItem("toService");
      if (storedToService) setToService(storedToService);
    }
  }, [fromService, toService]);

  // Render the conversion component
  const renderConversionComponent = () => {
    if (!selectedPlaylist || !isReadyForConversion) {
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

      {/* Left Panel: "From" Service */}
      <div className="panel left-panel">
        <h3>Convert From:</h3>
        <button onClick={() => selectService("spotify", "from")}>Spotify</button>
        <button onClick={() => selectService("youtube", "from")}>YouTube</button>

        {fromService === "spotify" && (
          fromAccessToken ? (
            <>
              <Dashboard accessToken={fromAccessToken} onTokenExpired={clearTokens} />
              <Playlists
                accessToken={fromAccessToken}
                onSelectPlaylist={handlePlaylistSelection}
              />
            </>
          ) : (
            <LoginWithSpotify
              onLogin={(token, expiresIn) => saveToken("spotify", token, expiresIn, "from")}
            />
          )
        )}

        {fromService === "youtube" && (
          fromAccessToken ? (
            <YouTubeDashboard accessToken={fromAccessToken} />
          ) : (
            <LoginWithYoutube
              onLogin={(token, expiresIn) => saveToken("youtube", token, expiresIn, "from")}
            />
          )
        )}
      </div>

      {/* Right Panel: "To" Service */}
      <div className="panel right-panel">
        <h3>Convert To:</h3>
        <button onClick={() => selectService("spotify", "to")}>Spotify</button>
        <button onClick={() => selectService("youtube", "to")}>YouTube</button>

        {toService === "spotify" && (
          toAccessToken ? (
            <Dashboard accessToken={toAccessToken} />
          ) : (
            <LoginWithSpotify
              onLogin={(token, expiresIn) => saveToken("spotify", token, expiresIn, "to")}
            />
          )
        )}

        {toService === "youtube" && (
          toAccessToken ? (
            <YouTubeDashboard accessToken={toAccessToken} />
          ) : (
            <LoginWithYoutube
              onLogin={(token, expiresIn) => saveToken("youtube", token, expiresIn, "to")}
            />
          )
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
