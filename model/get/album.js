const { Client } = require("pg");
const config = require('../config')
async function getAlbumById(id) {
    const client = new Client(config)
    client.connect()
    let response = await client.query(
        `SELECT * FROM album WHERE album_id = ${id};`
    )
    await client.end()
    return response.rows[0]
}

async function getAlbumIdByName(name) {
    const client = new Client(config)
    client.connect()
    let response = await client.query(
        `SELECT * FROM album WHERE name = '${name}';`
    )
    await client.end()
    return response.rows
}

module.exports={
    getAlbumById,
    getAlbumIdByName
}
