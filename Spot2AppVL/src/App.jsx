import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, useLocation } from 'react-router-dom';
import './App.css';
import LoginWithSpotify from './components/LoginWithSpotify'; // Spotify login component
import Dashboard from './components/Dashboard'; // New Dashboard component

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track whether user is logged in
  const [accessToken, setAccessToken] = useState(null); // Store the access token
  const location = useLocation();

  // Check for access token in the URL when the component mounts
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('access_token');

    if (token) {
      setAccessToken(token);
      setIsLoggedIn(true); // Set login state to true if token is present
    }
  }, [location]);

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/dashboard">
            {isLoggedIn ? <Dashboard accessToken={accessToken} /> : <LoginWithSpotify />}
          </Route>
          <Route path="/">
            <LoginWithSpotify />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
