import { useImperativeHandle } from "react";
import searchResults from "../Components/SearchResults/SearchResults";

const clientID = '7d5f165cf3d249eb91e626924fcb3515';
const redirectURL = 'http://localhost:3000/';
let accessToken;
const Spotify = {
    getAccessToken() {
        if(accessToken) {
            return accessToken;
        } 
        // check token
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/); 

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]); //for time
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURL}`;
            window.location = accessURL;

        }
    },

    search(term) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if(!jsonResponse.tracks) {
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri,
            }));
        });
        
    },
    
    savePlaylist(name, trackUris) {
        if (!name || !trackUris.length) {
            return;
        }
        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}`};
        let userId;
        return fetch(`https://api.spotify.com/v1/me`, {
            headers: headers
        }).then(response =>  response.json()
        ).then(jsonResponse => {
            userId = jsonResponse.id;
            return fetch(`https://api.spotify.com//v1/users/${userId}/playlists`, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({name: name})
            }).then(response => response.json()
            ).then(jsonResponse => {
                const playlistId = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({uris: trackUris})
                });
            });
        });

    }
};



export default Spotify;