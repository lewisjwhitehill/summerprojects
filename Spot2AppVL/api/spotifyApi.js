export async function searchSpotify(query, accessToken) {
    try {
        const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`;
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Spotify search failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.tracks && data.tracks.items.length > 0 ? data.tracks.items[0] : null;
    } catch (error) {
        console.error("Error in searchSpotify:", error);
        throw error;
    }
}

export const fetchSpotifyUserId = async (accessToken) => {
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error fetching Spotify user ID:", errorData);
      throw new Error("Failed to fetch Spotify user ID");
    }
  
    const data = await response.json();
    return data.id; // Return the user's Spotify ID
  };
  
export const createSpotifyPlaylist = async (accessToken, playlistName) => {
    try {
      // Fetch the Spotify user ID dynamically
      const userId = await fetchSpotifyUserId(accessToken);
  
      const response = await fetch(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            name: playlistName,
            description: "Created from YouTube playlist",
            public: false,
          }),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Spotify API Error:", errorData);
        throw new Error("Failed to create playlist");
      }
  
      const data = await response.json();
      console.log("Created Spotify playlist:", data);
      return data.id; // Return playlist ID
    } catch (error) {
      console.error("Error creating Spotify playlist:", error);
      throw error;
    }
  };
  

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
            const errorData = await response.json();
            console.error("Spotify API Error:", errorData);
            throw new Error("Failed to add track to playlist");
        }

        console.log(`Track ${trackUri} added to playlist ${playlistId}`);
    } catch (error) {
        console.error("Error adding track to Spotify playlist:", error);
        throw error;
    }
}
