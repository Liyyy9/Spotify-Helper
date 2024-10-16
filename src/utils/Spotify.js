let accessToken = "";
const clientID = "d5ab5fa54951407b8dd12d9bd0ae1677";
// const redirectUrl = "http://localhost:3000";
const redirectUrl = "https://liyanaspotifyhelper.surge.sh";

// const Spotify stores function objects
const Spotify = {
  getAccessToken() {    // getAccessToken Function Object creates the accessToken if not found
    // First check for the access token
    if (accessToken) return accessToken;

    const tokenInURL = window.location.href.match(/access_token=([^&]*)/);
    const expiryTime = window.location.href.match(/expires_in=([^&]*)/);

    // Second check for the access token
    if (tokenInURL && expiryTime) {
      // setting access token and expiry time variables
      accessToken = tokenInURL[1];
      const expiresIn = Number(expiryTime[1]);

      console.log("AccessToken: " + accessToken, "Expiry: " + expiresIn);

      // Setting the access token to expire at the value for expiration time
      // clear accessToken after expiry
      // If expires_in = 3600 (1 hour), accessToken'll be cleared after 1 hour (3600 * 1000 ms = 3,600,000 ms or 1 hour).
      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
      // clearing the url after the access token expires
      window.history.pushState("Access token", null, "/");
      return accessToken;
    } else {
      // Third check for the access token if the first and second check are both false
      const redirect = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUrl}`;
      window.location = redirect;
    }
  },

  async search(term) {                                                                  // search Function Object takes in a term to search for

    if (term === null || term === undefined || term === "")
      return;

    accessToken = Spotify.getAccessToken();
    return await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((response) => response.json())
      .then((jsonresponse) => {
        if (!jsonresponse) {
          console.error("Response error");
        }
        return jsonresponse.tracks.items.map((t) => ({
          id: t.id,
          name: t.name,
          artist: t.artists[0].name,
          album: t.album.name,
          uri: t.uri,
        }));
      });
  },

  savePlaylist(name, trackUris) {                                                       // savePlayList takes in the name and the Url of the track to save
    if (!name || !trackUris)
      return;

    const token = Spotify.getAccessToken();
    const header = { Authorization: `Bearer ${token}` };
    let userId;

    return fetch(`https://api.spotify.com/v1/me`, { headers: header })                   // fetch my profile
      .then((response) => response.json())
      .then((jsonResponse) => {
        // process the response
        userId = jsonResponse.id;
        console.log("My User Id: ", userId);
        let playlistId = "";

        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {                // fetch playlist of my profile and store the name of my playlist
          headers: header,
          method: "POST",
          body: JSON.stringify({name: name})
        })
          .then((response) => response.json())
          .then((jsonResponse) => {
            playlistId = jsonResponse.id;

            return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {       // fetch playlist of my profile and store the songs
              headers: header,
              method: "POST",
              body: JSON.stringify({ uris: trackUris })
            })

          })
      })
  }

};

export { Spotify };