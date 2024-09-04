import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import LoginWithSpotify from './components/LoginWithSpotify';
import Dashboard from './components/Dashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('access_token');
    if (token) {
      setAccessToken(token);
      setIsLoggedIn(true);
    }
  }, [location]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginWithSpotify />} />
          <Route
            path="/dashboard"
            element={isLoggedIn ? <Dashboard accessToken={accessToken} /> : <LoginWithSpotify />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
