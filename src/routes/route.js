const express = require("express");

const router = express.Router();

const controlller = require("../controller/urlController");

router.post("/url/shorten", controlller.createUrl);

router.get("/:urlCode", controlller.getUrl);

module.exports = router;
