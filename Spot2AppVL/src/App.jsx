import { useState } from "react";
import "./App.css";
import LoginWithSpotify from "./components/LoginWithSpotify.jsx";
import Dashboard from "./components/Dashboard.jsx"; // Assume you have this component

function App() {
  const [accessToken, setAccessToken] = useState(null); // Store the access token

  // This function will be triggered when the user logs in and we get the token
  const handleLogin = (token) => {
    setAccessToken(token); // Set the token and consider the user logged in
  };

  return (
    <>
      <div className="card">
        {/* Conditionally render Dashboard if logged in, otherwise show login */}
        {accessToken ? (
          <Dashboard />
        ) : (
          <LoginWithSpotify onLogin={handleLogin} />
        )}
      </div>
    </>
  );
}

export default App;
