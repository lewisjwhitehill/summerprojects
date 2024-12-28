import React, { useState } from "react";

function LoginWithSpotify({ onLogin }) {
  const [isLoading, setIsLoading] = useState(false);
  const storedToken = localStorage.getItem("from_spotifyAccessToken");
  const storedExpiry = localStorage.getItem("from_spotifyTokenExpiry");

  if (storedToken && Date.now() < storedExpiry) {
    // Auto-login
    onLogin(storedToken, (storedExpiry - Date.now()) / 1000);
    return null; // Hide login button
  }

  const handleLogin = () => {
    setIsLoading(true);
    window.location.href = "/api/spotify"; // Redirect to Spotify OAuth
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Connect Your Spotify Account</h1>
      <button
        onClick={handleLogin}
        disabled={isLoading}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: isLoading ? "#ccc" : "#1DB954",
          color: "#ffffff",
          border: "none",
          borderRadius: "25px",
          cursor: "pointer",
        }}
      >
        {isLoading ? "Redirecting..." : "Login with Spotify"}
      </button>
    </div>
  );
}

export default LoginWithSpotify;
