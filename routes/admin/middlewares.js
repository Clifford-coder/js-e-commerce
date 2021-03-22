const { validationResult } = require('express-validator');

module.exports = {
	handleErrors(templeteFunc, dataCalback) {
		return async (req, res, next) => {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				let data = {};
				//dataCalback is optional argument. So check if it was provided.
				if (dataCalback) {
					data = await dataCalback(req);
				}

				return res.send(templeteFunc({ errors, ...data }));
			}

			//invoke the next func when everything went well with no errors.
			next();
		};
	},
	//every middleware function take these three argument in the strict order
	requireAuth(req, res, next) {
		if (!req.session.userId) {
			return res.redirect('/signin');
		}
		next();
	},
};
