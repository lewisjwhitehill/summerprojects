import React, { useState } from "react";

function LoginWithSpotify() {
  const [isLoading, setIsLoading] = useState(false); // State to handle loading

  const handleLogin = () => {
    setIsLoading(true); // Set loading to true when login starts

    // Redirect to your serverless function that starts the Spotify OAuth flow
    console.log("Redirecting to Spotify OAuth flow...");
    window.location.href = "/api/spotify"; // Make sure this is set up correctly
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Connect Your Spotify Account</h1>
      <p>To use our app, please log in with your Spotify account.</p>
      {/* Disable button while loading to prevent multiple clicks */}
      <button
        onClick={handleLogin}
        disabled={isLoading}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: isLoading ? "#ccc" : "#1DB954", // Change button color when loading
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
