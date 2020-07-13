const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const Schema = mongoose.Schema;
const userSchema = new Schema({
	username: {
		type: String,
		unique: true,
	},
	password: String,
	avatar: String,
	bio: String,
	name: String,
	createdAt: { type: Date, default: Date.now },
	followers: [],
	following: [],
	quacks: [
		{
			_id: mongoose.ObjectId,
			originalQuacker: String,
			likes: [],
			createdAt: { type: Date, default: Date.now },
			comments: [
				{
					commenterId: String,
					_id: mongoose.ObjectId,
					comment: String,
					likes: [],
				},
			],
		},
	],
});

userSchema.pre(
	'save',
	function (next) {
		var user = this;
		if (!user.isModified('password')) {
			return next();
		}
		bcrypt.hash(user.password, 10).then((hashedPassword) => {
			user.password = hashedPassword;
			next();
		});
	},
	function (err) {
		next(err);
	}
);
userSchema.methods.comparePassword = function (candidatePassword, next) {
	bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
		if (err) return next(err);
		next(null, isMatch);
	});
};

const User = mongoose.model('User', userSchema);

module.exports = User;
