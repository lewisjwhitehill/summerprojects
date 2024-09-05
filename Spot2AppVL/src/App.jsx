import { useState } from "react";
import "./App.css";
import LoginWithSpotify from "./components/LoginWithSpotify.jsx";
import Dashboard from "./components/Dashboard.jsx"; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 

function App() {
  const [accessToken, setAccessToken] = useState(null); 

  const handleLogin = (token) => {
    setAccessToken(token); 
  };

  return (
    <Router> {/* Wrap the app with Router */}
      <div className="card">
        {/* Conditionally render Dashboard if logged in, otherwise show login */}
        <Routes>
          {/* Define routes here */}
          {accessToken ? (
            <Route path="/dashboard" element={<Dashboard accessToken={accessToken} />} />
          ) : (
            <Route path="/" element={<LoginWithSpotify onLogin={handleLogin} />} />
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
