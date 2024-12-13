export async function searchSpotify(query, accessToken) {
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`;
    const response = await fetch(url, {
        headers: {
        Authorization: `Bearer ${accessToken}`,
        },
    });
    const data = await response.json();
    return data.tracks && data.tracks.items.length > 0 ? data.tracks.items[0] : null;
}


export async function createSpotifyPlaylist(accessToken, title) {
    try {
      const userProfileResponse = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (!userProfileResponse.ok) {
        throw new Error("Failed to fetch user profile");
      }
  
      const userProfile = await userProfileResponse.json();
  
      const playlistResponse = await fetch(
        `https://api.spotify.com/v1/users/${userProfile.id}/playlists`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            name: title,
            description: "Playlist created via API",
            public: false,
          }),
        }
      );
  
      if (!playlistResponse.ok) {
        throw new Error("Failed to create playlist");
      }
  
      const playlistData = await playlistResponse.json();
      return playlistData.id; // Return the playlist ID
    } catch (error) {
      console.error("Error creating Spotify playlist:", error);
      throw error;
    }
}

  
export async function addTrackToPlaylist(accessToken, playlistId, trackUri) {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            uris: [trackUri], // Track URI must be in an array
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to add track to playlist");
      }
  
      console.log(`Track ${trackUri} added to playlist ${playlistId}`);
    } catch (error) {
      console.error("Error adding track to Spotify playlist:", error);
      throw error;
    }
}
  