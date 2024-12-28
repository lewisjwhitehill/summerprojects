import React from "react";

const LoginWithYoutube = ({ onLogin }) => {
  const storedToken = localStorage.getItem("from_youtubeAccessToken");
  const storedExpiry = localStorage.getItem("from_youtubeTokenExpiry");

  if (storedToken && Date.now() < storedExpiry) {
    // Auto-login
    onLogin(storedToken, (storedExpiry - Date.now()) / 1000);
    return null; // Hide login button
  }

  const handleLogin = () => {
    window.location.href = "/api/youtube"; // Redirect to YouTube OAuth
  };

  return <button onClick={handleLogin}>Login with YouTube</button>;
};

export default LoginWithYoutube;
