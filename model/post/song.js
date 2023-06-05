const {Client} = require("pg");
const config = require("../config");

async function addSong(song) {
    const client = new Client(config)
    client.connect()
    let response = await client.query(
        `INSERT INTO song(
            title, artist_id, album_id, year, duration)
        VALUES(
            '${song.title}',
            ${song.artist_id},
            ${song.album_id},
            ${song.year},
            ${song.duration}
        );`
    )
    await client.end()
    return response.rows[0]
}