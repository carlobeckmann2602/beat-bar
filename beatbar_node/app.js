function main() {
  require("dotenv").config();
  let esPkg = require("essentia.js");
  const express = require("express");

  const essentia = new esPkg.Essentia(esPkg.EssentiaWASM);
  const app = express();

  // prints version of the essentia wasm backend
  // console.log(essentia.version)

  // prints all the available algorithm methods in Essentia
  // console.log(essentia.algorithmNames)

  const indexRoutes = require("./routing/index");
  app.use("/", indexRoutes);

  const getSongRoutes = require("./routing/get/song");
  app.use("/api/get/song/", getSongRoutes);

  const getArtistRoutes = require("./routing/get/artist");
  app.use("/api/get/artist/", getArtistRoutes);

  const getAlbumRoutes = require("./routing/get/album");
  app.use("/api/get/album/", getAlbumRoutes);

  const port = 3000;

  const essentiaTest = require("./src/essentia");
  //essentiaTest(essentia)
  //essentiaTest.essentiaTestTwo()

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

main();