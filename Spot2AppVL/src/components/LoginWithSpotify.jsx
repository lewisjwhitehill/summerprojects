import React from 'react';

function LoginWithSpotify() {
  const handleLogin = () => {
    // Redirect to your serverless function that starts the Spotify OAuth flow
    console.log("About to switch where we are!");
    window.location.href = '/api/spotify';
   
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Connect Your Spotify Account</h1>
      <p>To use our app, please log in with your Spotify account.</p>
      <button
        onClick={handleLogin}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#1DB954',
          color: '#ffffff',
          border: 'none',
          borderRadius: '25px',
          cursor: 'pointer',
        }}
      >
        Login with Spotify
      </button>
    </div>
  );
}

export default LoginWithSpotify;