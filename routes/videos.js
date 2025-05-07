const express = require('express');
const router = express.Router();
const videoController = require('../controller/videoController');

/* GET video listing. */
router.get('/list', videoController.videoList);

module.exports = router;
