const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

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

const User = mongoose.model.apply('User', userSchema);

module.exports = User;
