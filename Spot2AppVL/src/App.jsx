import { useState } from "react";
import "./App.css";
import LoginWithSpotify from "./components/LoginWithSpotify.jsx";
import Dashboard from "./components/Dashboard.jsx"; // Assume you have this component

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state

  // This function will be called when the user logs in (you can adjust based on actual login logic)
  const handleLogin = () => {
    setIsLoggedIn(true); // Update state to show Dashboard
  };

  return (
    <>
      <div className="card">
        {/* Conditionally render based on whether the user is logged in */}
        {isLoggedIn ? (
          <Dashboard />
        ) : (
          <LoginWithSpotify onLogin={handleLogin} />
        )}
      </div>
    </>
  );
}

export default App;
