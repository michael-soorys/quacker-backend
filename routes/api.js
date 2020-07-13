var express = require('express');
var passport = require('passport');
var router = express.Router();
var User = require('../models/user');

const mongoose = require('mongoose');

/* GET users listing. */
router.get('/', function (req, res, next) {
	res.send('test');
});

router.post('/register-user', (req, res, next) => {
	passport.authenticate('register', (err, user, info) => {
		if (err) {
			console.log(err);
		}
		if (info != undefined) {
			console.log(info.message);
			res.send(info.message);
		} else {
			req.logIn(user, (err) => {
				console.log('user created in db');
				res.status(200).send({ message: 'user created' });
			});
		}
	})(req, res, next);
});

module.exports = router;
