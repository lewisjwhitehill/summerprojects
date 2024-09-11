import { useState, useEffect } from "react";
import "./App.css";
import LoginWithSpotify from "./components/LoginWithSpotify.jsx";
import Dashboard from "./components/Dashboard.jsx"; 
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'; 

function App() {
  const [accessToken, setAccessToken] = useState(null);

  // Function to extract query parameters from the URL
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  useEffect(() => {
    const query = useQuery();
    const token = query.get("access_token");

    if (token) {
      setAccessToken(token);
      // Optionally, you can remove the token from the URL after setting it
      window.history.replaceState({}, document.title, "/");
    }
  }, []);


  return (
    <AuthContext.Provider value={accessToken}>
      <Router>
        <div className="card">
          <Routes>
            {accessToken ? (
              <Route path="/" element={<Dashboard />} />
            ) : (
              <Route path="/" element={<LoginWithSpotify onLogin={setAccessToken} />} />
            )}
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
