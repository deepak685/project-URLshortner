const express = require('express');
const router = express.Router();
const control=require("./controller")


//------------------API's--------------------

router.post('/url/shorten',control.createUrl)
router.get( "/:urlCode",control.getUrl)

module.exports = router;
