const { Client } = require("pg");
const config = require("../config");

async function addAlbum(album) {
  const client = new Client(config);
  client.connect();
  let response = await client.query(
    `INSERT INTO album(
            name,
            year
        )
        VALUES(
            '${album.name}',
            ${album.year}
        );`
  );
  await client.end();
  return response.rows[0];
}
