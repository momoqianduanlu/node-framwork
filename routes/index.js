const express = require('express');
const router = express.Router();

router.use('/video', require('./videos'))
router.use('/user', require('./users'))

module.exports = router;
