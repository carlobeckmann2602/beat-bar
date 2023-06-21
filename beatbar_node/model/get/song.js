const { Client } = require("pg");
const ALGORITHMS = {
  meyda: "meyda_properties",
  essentia: "essentia_properties",
};
const config = require("../config");

async function getSongById(id, requestedAlgorithm) {
  const client = new Client(config);
  const selectedAlgorithm = ALGORITHMS[requestedAlgorithm];
  client.connect();
  let response = await client.query(
    `SELECT * FROM song JOIN ${
      selectedAlgorithm ?? "meyda_properties"
    } ON song.song_id = ${
      selectedAlgorithm ?? "meyda_properties"
    }.song_id WHERE song.song_id = ${id};`
  );
  await client.end();
  return response.rows[0];
}

async function getSongIdByTitle(title) {
  const client = new Client(config);
  client.connect();
  let response = await client.query(
    `SELECT * FROM song WHERE title = '${title}';`
  );
  await client.end();
  return response.rows;
}

module.exports = {
  getSongById,
  getSongIdByTitle,
};
