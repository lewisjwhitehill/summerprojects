// components/GoogleAuth.jsx
import React, { useEffect, useState } from 'react';

function GoogleAuth({ onAuthSuccess }) {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    function initClient() {
      window.gapi.client
        .init({
          clientId: 'YOUTUBE_GOOGLE_CLIENT_ID',
          scope: 'https://www.googleapis.com/auth/youtube',
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
        })
        .then(
          () => {
            const authInstance = window.gapi.auth2.getAuthInstance();
            setIsSignedIn(authInstance.isSignedIn.get());
            authInstance.isSignedIn.listen(setIsSignedIn);
            if (authInstance.isSignedIn.get()) {
              onAuthSuccess();
            }
          },
          (error) => {
            console.error('Error initializing Google API client:', error);
          }
        );
    }

    window.gapi.load('client:auth2', initClient);
  }, [onAuthSuccess]);

  const handleAuthClick = () => {
    window.gapi.auth2.getAuthInstance().signIn();
  };

  const handleSignOutClick = () => {
    window.gapi.auth2.getAuthInstance().signOut();
  };

  return (
    <div>
      {isSignedIn ? (
        <button onClick={handleSignOutClick}>Sign Out of Google</button>
      ) : (
        <button onClick={handleAuthClick}>Sign In with Google</button>
      )}
    </div>
  );
}

export default GoogleAuth;
