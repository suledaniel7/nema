var express = require('express');
var stat = require('../controllers/stats');
var router = express.Router();

router.get('/*', stat);

module.exports = router;