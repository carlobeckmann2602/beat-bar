const { Client } = require("pg");
const {response} = require("express");

async function getSongById(id, requestedAlgorithm) {
    const ALGORITHMS = {
        "meyda": "meyda_properties",
        "essentia": "essentia_properties"
    }
    const selectedAlgorithm = ALGORITHMS[requestedAlgorithm]
    console.log("id: ", id)
    const config = {
        user: process.env.BEAT_BAR_DB_USER,
        password: process.env.BEAT_BAR_DB_PASSWORD,
        host: process.env.BEAT_BAR_DB_HOST,
        database: process.env.BEAT_BAR_DB_DATABASE,
        port: process.env.BEAT_BAR_DB_PORT
    }
    const client = new Client(config)
    client.connect()
    let response = await client.query(
        `SELECT * FROM song JOIN ${selectedAlgorithm??'meyda_properties'} ON song.song_id = ${selectedAlgorithm??'meyda_properties'}.song_id WHERE song.song_id = ${id};`
    )
    await client.end()
    return response.rows[0]
}

module.exports={getSongById}
