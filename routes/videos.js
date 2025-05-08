const express = require('express');
const router = express.Router();
const videoController = require('../controller/videoController');
const vodController = require('../controller/vodController');

/* GET video listing. */
router.get('/list', videoController.videoList);

router.get('/getVod', vodController.getVod);

module.exports = router;
