const songPostModel = require('../../model/post/song')
const artistPostModel = require('../../model/post/artist')
const albumPostModel = require('../../model/post/album')
const artistGetModel = require("../../model/get/artist");
const albumGetModel = require("../../model/get/album");
async function addSong(song, artist, album) {
    let song_id = await songGetModel.getSongIdByTitle()
    if (song_id.length===0){
        let artist_id = await artistGetModel.getArtistIdByName()
        if(artist_id.length===0){
            artist_id[0] = await artistPostModel.addArtist(artist)
        }

        let album_id = await albumGetModel.getAlbumIdByName()
        if(album_id.length===0){
            album_id[0] = await albumPostModel.addAlbum()
        }

        song.artist_id = artist_id[0].artist_id
        song.album_id = album_id[0].album_id

        await songPostModel.addSong(song)
    }
}