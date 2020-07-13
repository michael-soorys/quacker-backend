const passport = require('passport');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;

const passportRegister = (req, res, next) => {
	passport.authenticate('register', (err, user, info) => {
		if (err) {
			next(new Error(err));
		}

		// Info should be undefined if everything is ok
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
};

const passportLogin = (req, res, next) => {
	passport.authenticate('login', (err, user, info) => {
		if (err) {
			next(new Error(err));
		}

		// Info should be undefined if everything is ok
		if (info != undefined) {
			console.log(info.message);
			res.send(info.message);
		} else {
			req.logIn(user, (err) => {
				User.findOne({ username: user.username }, (err, user) => {
					// Handle errors
					if (err) {
						next(new Error(err));
					}
					const token = jwt.sign({ id: user.username }, jwtSecret);
					res.status(200).send({
						auth: true,
						token: token,
						message: 'user found & logged in',
					});
				});
			});
		}
	})(req, res, next);
};

const jwtChecker = (req, res, next) => {
	passport.authenticate('jwt', { session: false }, (err, user, info) => {
		if (err) {
			console.log(err);
		}
		if (info != undefined) {
			console.log(info.message);
			res.send(info.message);
		}
		next();
	})(req, res, next);
};

exports.jwtChecker = jwtChecker;
exports.passportRegister = passportRegister;
exports.passportLogin = passportLogin;
