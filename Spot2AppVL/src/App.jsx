import React, { useState, useEffect } from "react";
import "./App.css";
import LoginWithSpotify from "./components/LoginWithSpotify.jsx";
import Dashboard from "./components/Dashboard.jsx";

function App() {
  const [accessToken, setAccessToken] = useState(null);

  // Function to extract the access token from the URL query parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("access_token");

    if (token) {
      setAccessToken(token);
      // Optionally, you can remove the token from the URL once it's set

      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  return (
    <div className="card">
      {accessToken ? (
        <Dashboard accessToken={accessToken} />
        
      ) : (
        <LoginWithSpotify onLogin={setAccessToken} />
      )}
    <h1>{accessToken}</h1>
  </div>
  );
}

export default App;
