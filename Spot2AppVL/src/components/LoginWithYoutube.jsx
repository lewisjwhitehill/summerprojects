import React, { useEffect } from 'react';

const LoginWithYoutube = ({ onLogin }) => {
  const handleLogin = () => {
    window.location.href = '/api/youtube'; // Redirect to YouTube OAuth (make sure this endpoint exists)
  };

  // After redirecting back from OAuth flow, extract the token from URL and call onLogin
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    const expiresIn = params.get('expires_in');

    // If the access token and expiry are found, call the onLogin prop function
    if (accessToken && expiresIn) {
      onLogin(accessToken, expiresIn);
      window.history.replaceState({}, document.title, "/"); // Clean up URL
    }
  }, [onLogin]);

  return (
    <button onClick={handleLogin}>Login with YouTube</button>
  );
};

export default LoginWithYoutube;
