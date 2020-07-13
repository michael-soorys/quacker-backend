const bcrypt = require('bcrypt');
const User = require('../models/user');

const BCRYPT_SALT_ROUNDS = 12;

const passport = require('passport'),
	localStrategy = require('passport-local').Strategy,
	JWTstrategy = require('passport-jwt').Strategy,
	ExtractJWT = require('passport-jwt').ExtractJwt;

passport.use(
	'register',
	new localStrategy(
		{
			usernameField: 'username',
			passwordField: 'password',
			session: false,
		},
		(username, password, done) => {
			console.log(username);
			try {
				User.findOne(
					{
						username: username,
					},
					(err, user) => {
						if (err) {
							console.log('Error finding username inside the try block');
							return err;
						}
						if (user != null) {
							console.log('Username already taken');
							return done(null, false, { message: 'Username already taken' });
						} else {
							bcrypt
								.hash(password, BCRYPT_SALT_ROUNDS)
								.then((hashedPassword) => {
									user = createAndSaveUser(username, hashedPassword);
									return done(null, user);
								});
						}
					}
				);
			} catch (err) {
				done(err);
			}
		}
	)
);

passport.use(
	'login',
	new localStrategy(
		{
			usernameField: 'username',
			passwordField: 'password',
			session: false,
		},
		(username, password, done) => {
			try {
				User.findOne(
					{
						username: username,
					},
					(err, user) => {
						if (err) {
							console.log('Error finding username inside the try block');
							return err;
						}
						if (user === null) {
							return done(null, false, { message: 'Bad username' });
						} else {
							comparePasswordHashes(password, user.password);
						}
					}
				);
			} catch (err) {
				done(err);
			}
		}
	)
);

const opts = {
	jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
	secretOrKey: process.env.JWT_SECRET,
};

passport.use(
	'jwt',
	new JWTstrategy(opts, (jwt_payload, done) => {
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

const comparePasswordHashes = (input, password) => {
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
