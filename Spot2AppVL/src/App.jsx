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

  const saveToken = (service, token, expiresIn, context) => {
    const expiryTime = Date.now() + expiresIn * 1000;
    localStorage.setItem(`${context}_${service}AccessToken`, token);
    localStorage.setItem(`${context}_${service}TokenExpiry`, expiryTime);
    if (context === "from") setFromAccessToken(token);
    else setToAccessToken(token);
  };

  const handlePlaylistSelection = (playlistId) => {
    setSelectedPlaylist(playlistId);
    console.log("Selected Playlist ID:", playlistId);
  };

  const clearTokens = () => {
    ["spotify", "youtube"].forEach((service) => {
      localStorage.removeItem(`${service}AccessToken`);
      localStorage.removeItem(`${service}TokenExpiry`);
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

  useEffect(() => {
    const handleToken = (service, context, setToken) => {
      const queryParams = new URLSearchParams(window.location.search);
      const token = queryParams.get("access_token");
      const expiresIn = queryParams.get("expires_in");

      if (token && expiresIn) {
        saveToken(service, token, expiresIn, context);
        window.history.replaceState({}, document.title, "/");
      } else {
        const storedToken = localStorage.getItem(`${context}_${service}AccessToken`);
        const storedExpiry = localStorage.getItem(`${context}_${service}TokenExpiry`);
        if (storedToken && storedExpiry && Date.now() < storedExpiry) {
          setToken(storedToken);
        } else {
          localStorage.removeItem(`${context}_${service}AccessToken`);
          localStorage.removeItem(`${context}_${service}TokenExpiry`);
        }
      }
    };

    if (fromService) {
      handleToken(fromService, "from", setFromAccessToken);
    }

    if (toService) {
      handleToken(toService, "to", setToAccessToken);
    }
  }, [fromService, toService]);

  const renderConversionComponent = () => {
    if (!selectedPlaylist || !isReadyForConversion) {
      return <p>Please log in to both services to proceed.</p>;
    }
    console.log("fromService:", fromService);
    console.log("toService:", toService);
    console.log("selectedPlaylist:", selectedPlaylist);
    console.log("fromAccessToken:", fromAccessToken);
    console.log("toAccessToken:", toAccessToken);
  
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
        <button onClick={() => setFromService("spotify")}>Spotify</button>
        <button onClick={() => setFromService("youtube")}>YouTube</button>

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
              onLogin={(token, expiresIn) => setFromAccessToken(token)}
            />
          )
        )}

        {fromService === "youtube" && (
          fromAccessToken ? (
            <YouTubeDashboard accessToken={fromAccessToken} />
          ) : (
            <LoginWithYoutube
              onLogin={(token, expiresIn) => setFromAccessToken(token)}
            />
          )
        )}
      </div>

      {/* Right Panel: "To" Service */}
      <div className="panel right-panel">
        <h3>Convert To:</h3>
        <button onClick={() => setToService("spotify")}>Spotify</button>
        <button onClick={() => setToService("youtube")}>YouTube</button>

        {toService === "spotify" && (
          toAccessToken ? (
            <Dashboard accessToken={toAccessToken} />
          ) : (
            <LoginWithSpotify
              onLogin={(token, expiresIn) => setToAccessToken(token)}
            />
          )
        )}

        {toService === "youtube" && (
          toAccessToken ? (
            <YouTubeDashboard accessToken={toAccessToken} />
          ) : (
            <LoginWithYoutube
              onLogin={(token, expiresIn) => setToAccessToken(token)}
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
