var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');

/* GET users listing. */
router.get('/', function (req, res, next) {
	res.send('test');
});

module.exports = router;
