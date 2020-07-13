var express = require('express');
var router = express.Router();
var passportMiddleware = require('../middleware/passportMiddleware');

const mongoose = require('mongoose');

// Destructure passport middleware
const { jwtChecker, passportRegister, passportLogin } = passportMiddleware;

router.get('/', function (req, res, next) {
	res.send('test');
});

// Login and registration routes
router.post('/register', passportRegister);
router.post('/login', passportLogin);

/**
 *
 * Protected routes bellow
 *
 */

router.use(jwtChecker); // Verify JWT token

router.get('/test', (req, res, next) => {
	res.send('found');
});

module.exports = router;
