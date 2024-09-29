const createPlaylist = async () => {
    const response = await fetch(
      "https://www.googleapis.com/youtube/v3/playlists?part=snippet",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          snippet: {
            title: "My New Playlist",
            description: "Playlist created via API",
          },
        }),
      }
    );
    const data = await response.json();
    console.log(data); 
  };
  