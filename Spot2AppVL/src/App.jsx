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
    <Router>
      <div className="card">
        <Routes>
          {accessToken ? (
            <Route path="/Dashboard" element={<Dashboard accessToken={accessToken} />} />
          ) : (
            <Route path="/" element={<LoginWithSpotify onLogin={handleLogin} />} />
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
