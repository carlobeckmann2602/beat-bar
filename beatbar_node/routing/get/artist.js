const express = require("express");
const router = express.Router();
const artistGetModel = require("../../model/get/artist");

router.get("/getidbyname/:name", (req, res) => {
  artistGetModel.getArtistIdByName(req.params.name).then((response) => {
    res.status(200);
    res.send(response);
  });
});

router.get("/:id", (req, res) => {
  artistGetModel.getArtistById(req.params.id).then((response) => {
    res.status(200);
    res.send(response);
  });
});

module.exports = router;
