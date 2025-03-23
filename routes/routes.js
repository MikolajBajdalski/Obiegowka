const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Serwer działa!");
});

module.exports = router;
