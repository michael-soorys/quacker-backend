const bcrypt = require('bcrypt');
const User = require('../models/user');

const BCRYPT_SALT_ROUNDS = 12;

const passport = require('passport'),
	localStrategy = require('passport-local').Strategy,
	JWTstrategy = require('passport-jwt').Strategy,
	ExtractJWT = require('passport-jwt').ExtractJwt;

const localStrategyOptions = {
	usernameField: 'username',
	passwordField: 'password',
	session: false,
};

passport.use(
	'register',
	new localStrategy(localStrategyOptions, (username, password, done) => {
		console.log(username);
		try {
			// Try find the user by username
			User.findOne({ username }, (err, user) => {
				if (err) {
					console.log('Error finding username inside the try block');
					return err;
				}
				// If user's name is already in the database
				if (user != null) {
					console.log('Username already taken');
					return done(null, false, { message: 'Username already taken' });
				} else {
					// Create the user
					// Password hashing is done inside a mongoose pre-save method
					user = createAndSaveUser(username, password);
					return done(null, user);
				}
			});
		} catch (err) {
			done(err);
		}
	})
);

passport.use(
	'login',
	new localStrategy(localStrategyOptions, (username, password, done) => {
		try {
			User.findOne({ username }, (err, user) => {
				if (err) {
					console.log('Error finding username inside the try block');
					return err;
				}
				// If no user is found alert the user
				if (user === null) {
					return done(null, false, { message: 'Bad username' });
				} else {
					// Check if password matches
					comparePasswordHashes(password, user.password, done, user);
				}
			});
		} catch (err) {
			done(err);
		}
	})
);

const jwtOptions = {
	jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
	secretOrKey: process.env.JWT_SECRET,
};

passport.use(
	'jwt',
	new JWTstrategy(jwtOptions, (jwt_payload, done) => {
		try {
			User.findOne(
				{
					username: jwt_payload.id,
				},
				(err, user) => {
					if (err) {
						console.log('JWT issue, check config/passport.js');
						return err;
					}
					if (user) {
						console.log('user found in db in passport');
						// note the return removed with passport JWT - add this return for passport local
						done(null, user);
					} else {
						console.log('user not found in db');
						done(null, false);
					}
				}
			);
		} catch (err) {
			done(err);
		}
	})
);

// Creates and saves user on the database
const createAndSaveUser = (username, password, done) => {
	if (!username || !password) {
		return console.log('Bad inputs for createAndSaveUser');
	}
	const user = new User({
		username,
		password,
	});

	user.save(function (err, user) {
		if (err) return console.error(err);
	});
	return user;
};

// Compare password hashes

const comparePasswordHashes = (input, password, done, user) => {
	bcrypt.compare(input, password).then((response) => {
		if (response !== true) {
			console.log('Passwords do not match');
			return done(null, false, {
				message: 'Passwords do not match',
			});
		}
		console.log('user found & authenticated');
		// note the return needed with passport local - remove this return for passport JWT
		return done(null, user);
	});
};
