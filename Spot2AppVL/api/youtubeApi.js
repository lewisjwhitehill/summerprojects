// youtubeApi.js

export async function searchYouTube(query, accessToken) {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    return data.items && data.items.length > 0 ? data.items[0] : null;
  }
  
  export async function createYouTubePlaylist(accessToken, title) {
    const response = await fetch('https://www.googleapis.com/youtube/v3/playlists?part=snippet%2Cstatus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        snippet: { title, description: 'Converted from Spotify playlist' },
        status: { privacyStatus: 'private' },
      }),
    });
  
    const data = await response.json();
    return data.id;
  }
  
  export async function addVideoToPlaylist(accessToken, playlistId, videoId) {
    await fetch('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        snippet: {
          playlistId: playlistId,
          resourceId: {
            kind: 'youtube#video',
            videoId: videoId,
          },
        },
      }),
    });
  }