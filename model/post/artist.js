const {Client} = require("pg");
const config = require("../config");

async function addArtist(artist) {
    const client = new Client(config)
    client.connect()
    let response = await client.query(
        `INSERT INTO artist(
            name
        )
        VALUES(
            '${artist.name}'
        );`
    )
    await client.end()
    return response.rows[0]
}