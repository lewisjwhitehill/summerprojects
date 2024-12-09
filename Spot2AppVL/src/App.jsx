import React, { useState, useEffect } from "react";
import "./App.css";
import LoginWithSpotify from "./components/LoginWithSpotify";
import LoginWithYoutube from "./components/LoginWithYoutube";
import Dashboard from "./components/Dashboard"; // Spotify Dashboard
import YouTubeDashboard from "./components/YoutubeDashboard"; // YouTube Dashboard
import YouTubeAddPlaylist from "./components/YoutubeAddPlaylist";
import Playlists from "./components/Playlists";

function App() {
  const [fromService, setFromService] = useState(""); // Source service
  const [toService, setToService] = useState(""); // Target service
  const [spotifyAccessToken, setSpotifyAccessToken] = useState(null);
  const [youtubeAccessToken, setYouTubeAccessToken] = useState(null);
  const [fromAccessToken, setFromAccessToken] = useState(null); // Access token for "from" service
  const [toAccessToken, setToAccessToken] = useState(null); // Access token for "to" service
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [message, setMessage] = useState("");

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

    setSpotifyAccessToken(null);
    setYouTubeAccessToken(null);
    setFromAccessToken(null);
    setToAccessToken(null);
    setMessage("Tokens have been cleared.");
    setTimeout(() => setMessage(""), 3000);
  };

  useEffect(() => {
    if (!fromService) return;

    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("access_token");
    const expiresIn = queryParams.get("expires_in");

    if (token && expiresIn) {
      saveToken(fromService, token, expiresIn, "from");
      window.history.replaceState({}, document.title, "/");
    } else {
      const storedToken = localStorage.getItem(`from_${fromService}AccessToken`);
      const storedExpiry = localStorage.getItem(`from_${fromService}TokenExpiry`);
      if (storedToken && storedExpiry && Date.now() < storedExpiry) {
        setFromAccessToken(storedToken);
      } else {
        localStorage.removeItem(`from_${fromService}AccessToken`);
        localStorage.removeItem(`from_${fromService}TokenExpiry`);
      }
    }
    console.log("From Service:", fromService, "Token:", fromAccessToken);
    console.log("To Service:", toService, "Token:", toAccessToken);
  }, [fromService]);

  useEffect(() => {
    if (!toService) return;

    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("access_token");
    const expiresIn = queryParams.get("expires_in");

    if (token && expiresIn) {
      saveToken(toService, token, expiresIn, "to");
      window.history.replaceState({}, document.title, "/");
    } else {
      const storedToken = localStorage.getItem(`to_${toService}AccessToken`);
      const storedExpiry = localStorage.getItem(`to_${toService}TokenExpiry`);
      if (storedToken && storedExpiry && Date.now() < storedExpiry) {
        setToAccessToken(storedToken);
      } else {
        localStorage.removeItem(`to_${toService}AccessToken`);
        localStorage.removeItem(`to_${toService}TokenExpiry`);
      }
    }
    console.log("From Service:", fromService, "Token:", fromAccessToken);
    console.log("To Service:", toService, "Token:", toAccessToken);
  }, [toService]);

  return (
    <div className="app-container">
      {/* Clear Tokens Button with Feedback */}
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
              {selectedPlaylist && fromService === "spotify" && toService === "youtube" && fromAccessToken && toAccessToken ? (
                <YouTubeAddPlaylist
                  playlistId={selectedPlaylist}
                  spotifyAccessToken={fromAccessToken}   // The Spotify token used to fetch tracks
                  youtubeAccessToken={toAccessToken}     // The YouTube token used to create the playlist
                />
              ) : (
                selectedPlaylist && <p>Please log in to YouTube to proceed.</p>
              )}
            </>
          ) : (
            <LoginWithSpotify
              onLogin={(token, expiresIn) => setFromAccessToken(token)}
            />
          )
        )}

        {fromService === "youtube" && (
          fromAccessToken ? (
            <YouTubeDashboard accessToken={fromAccessToken} onTokenExpired={clearTokens} />
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
    </div>
  );
}

export default App;