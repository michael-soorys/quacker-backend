const errorHandler = (err, req, res, next) => {
	if (err) {
		console.error(err.stack);
		res
			.status(500)
			.send(
				'Something broke, errorHandler caught the error, check the node console.'
			);
	}
};

module.exports = errorHandler;
