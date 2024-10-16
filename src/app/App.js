import './App.css';
import React, { useEffect, useState } from 'react';
import SearchBar from '../components/searchbar/SearchBar.jsx';
import SearchResults from '../components/searchresults/SearchResults.jsx';
import Playlist from '../components/playlist/Playlist.jsx';
import { Spotify } from '../utils/Spotify.js';

function App() {

  // state management (useState() hook) - to create an Array called searchResults
  const [searchResults, setSearchResults] = useState([]);
  const [playListTracks, setPlayListTracks] = useState([]);
  const [playListName, setPlayListName] = useState("New Playlist...");

  // sideEffect (Document Load) - called useEffect hook
  // The blank bracket refers to running this hook only once
  useEffect(() => {

    Spotify.getAccessToken();
    
    // populate searchResults with defaultValues
    setSearchResults([
      {
        id: 1,
        name: "Track 1",
        artist: "Track 1 Artist",
        album: "Track 1 Album",
        uri: "Track 1 Uri"
      },
      {
        id: 2,
        name: "Track 2",
        artist: "Track 2 Artist",
        album: "Track 2 Album",
        uri: "Track 2 Uri"
      },
      {
        id: 3,
        name: "Track 3",
        artist: "Track 3 Artist",
        album: "Track 3 Album",
        uri: "Track 3 Uri"
      },
    ]);

    setPlayListTracks([
      {
        id: 4,
        name: "Playlist 1",
        artist: "Playlist 1 Artist",
        album: "Playlist 1 Album",
        uri: "Playlist 1 Uri"
      },
      {
        id: 5,
        name: "Playlist 2",
        artist: "Playlist 2 Artist",
        album: "Playlist 2 Album",
        uri: "Playlist 2 Uri"
      },
    ]);

  }, []);

  // passed as a prop to SearchBar 
  // invokes the Spotify.search() 
  function search(term) {
    Spotify.search(term).then((response) => setSearchResults(response));
  }

  // passed as a prop to SearchResults 
  function addTrack(track) {
    const trackExists = playListTracks.find((currentTrack) =>
      currentTrack.id === track.id);

    if (!trackExists)
      setPlayListTracks([...playListTracks, track]);
  }

  // passed as a prop to Playlist 
  function removeTrack(track) { // return all the tracks except the track passed in (i.e. the track to be removed)
    const filteredTrack = playListTracks.filter((currentTrack) => currentTrack.id !== track.id);

    setPlayListTracks(filteredTrack);
  }

  // passed as a prop to PlayList (update playlist name)

  function updatePlayListName(strName){
    setPlayListName(strName);
  }

  // passed as a prop to PlayList (save new playlist)
  function savePlayList(){
    const tracksUri = playListTracks.map((track) => track.uri);

    Spotify.savePlaylist(playListName, tracksUri).then (() => {
      updatePlayListName("New Playlist");
      setPlayListTracks([]);
    });
  }

  console.log("my searchResults", searchResults);
  console.log("my playListTracks", playListTracks);
  console.log("My playlist name: ", playListName);

  return (
    <div>
      <h1>Spotify <span className="highlight">Helper</span></h1>
      <div className="App">
        {/* <!-- Add a SearchBar component --> */}
        <SearchBar onClick ={search} />
        <div className="App-playlist">
          {/* <!-- Add a SearchResults component --> */}
          <SearchResults
            searchResults={searchResults}
            onAdd={addTrack}
            onSave={savePlayList}
          />
          {/* <!-- Add a Playlist component --> */}
          <Playlist
            playListTracks={playListTracks}
            onRemove={removeTrack}
            playListName={playListName}
            updateName = {updatePlayListName}
            onSave={savePlayList}
          />

        </div>
      </div>
    </div>
  );
}

export default App;