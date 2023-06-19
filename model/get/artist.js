const { Client } = require("pg");
const config = require("../config");
async function getArtistById(id) {
  const client = new Client(config);
  client.connect();
  let response = await client.query(
    `SELECT * FROM artist WHERE artist_id = ${id};`
  );
  await client.end();
  return response.rows[0];
}

async function getArtistIdByName(name) {
  const client = new Client(config);
  client.connect();
  let response = await client.query(
    `SELECT * FROM artist WHERE name = '${name}';`
  );
  await client.end();
  return response.rows;
}

module.exports = {
  getArtistById,
  getArtistIdByName,
};
