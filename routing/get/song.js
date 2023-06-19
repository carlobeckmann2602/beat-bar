const express = require("express");
const router = express.Router();
const songGetModel = require("../../model/get/song");

router.get("/getidbytitle/:title", (req, res) => {
  songGetModel.getSongIdByTitle(req.params.title).then((response) => {
    res.status(200);
    res.send(response);
  });
});

router.get("/:song_id/:requestedAlgorithm", (req, res) => {
  songGetModel
    .getSongById(req.params.song_id, req.params.requestedAlgorithm)
    .then((response) => {
      res.status(200);
      res.send(response);
    })
    .catch((error) => {
      res.status(500);
      res.send({ error: "internal server error" });
    });
});

module.exports = router;
