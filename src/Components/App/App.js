import React from 'react';
import './App.css';

import  SearchBar  from '../SearchBar/SearchBar'; 
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';
import searchResults from '../SearchResults/SearchResults';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchResults: [],
            playlistName: 'My Playlist',
            playlistTracks: [],

        };
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.updatePlaylistName = this.updatePlaylistName.bind(this);
        this.savePlaylist = this.savePlaylist.bind(this);
        this.search = this.search.bind(this);
    }

    addTrack(track) {
        if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
            return;
          } else {
              this.state.playlistTracks.push(track);
          }
          this.setState({
              playlistTracks: this.state.playlistTracks
          });
    }

    removeTrack(track) {
        this.state.playlistTracks = this.state.playlistTracks.filter(currentTrack => currentTrack.id !== track.id);
        this.setState({
            playlistTracks: this.state.playlistTracks
        });
    }

    updatePlaylistName(name) {
        this.setState({
            playlistName: name
        });
    }

    savePlaylist() {
        const trackUris = this.state.playlistTracks.map(track => track.uri);
        Spotify.savePlaylist(this.state.playlistName, trackUris).then(() => {
            this.setState({
                playlistName: 'New Playlist',
                playlistTracks: []
            })
        })
    }

    search(term) {
        Spotify.search(term).then(searchResults => {
            this.setState({
                searchResults: searchResults
            })
        });
    }

    render() {
        return (
            <div>
                <h1>Ja<span class="highlight">mmm</span>ing</h1>
            <div class="App">
                <SearchBar onSearch={this.search}/>
            <div class="App-playlist">
                <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
                <Playlist playlistName={this.state.playlistName} 
                 playlistTracks={this.state.playlistTracks}
                 onRemove={this.removeTrack}
                 onNameChange={this.updatePlaylistName}
                 onSave={this.savePlaylist}/>
            </div>
        </div>
    </div>
        )
    }
}

export default App;
