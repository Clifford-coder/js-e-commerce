const { check } = require('express-validator');
const usersRepo = require('../../repos/Users');

module.exports = {
	emailValidation: check('email')
		.trim()
		.normalizeEmail()
		.isEmail()
		.withMessage('Must be a valid email')
		.custom(async (email) => {
			const existingUser = await usersRepo.getOneBy({ email });
			if (existingUser) {
				throw new Error('Email already in use');
			}
		}),
	passwordValidation: check('password')
		.trim()
		.isLength({ min: 8, max: 32 })
		.withMessage('Password must be between 8 to 32 characters'),
	passwordConfirmationValidation: check('passwordConfirmation')
		.trim()
		.isLength({ min: 8, max: 32 })
		.withMessage('Password must be between 8 to 32 characters')
		.custom((passwordConfirmation, { req }) => {
			if (passwordConfirmation !== req.body.password) {
				throw new Error('Passwords must match');
			}
			// Indicates the success of this synchronous custom validator
			return true;
		}),
	emailExistsValidation: check('email')
		.trim()
		.normalizeEmail()
		.isEmail()
		.withMessage('Must be a valid email')
		.custom(async (email) => {
			const existingUser = await usersRepo.getOneBy({ email });
			if (!existingUser) {
				throw new Error('the provided email does exist!');
			}
		}),
	correctPassword: check('password')
		.trim()
		.custom(async (password, { req }) => {
			const user = await usersRepo.getOneBy({ email: req.body.email });
			if (!user) {
				throw new Error('Invalid password');
			}
			const validPassword = await usersRepo.comparePasswords(user.password, password);

			//check for password match
			if (!validPassword) throw new Error('Invalid password');
		}),
	productTitleValidation: check('title')
		.trim()
		.isLength({ min: 4, max: 40 })
		.withMessage('Must be between 3 and 41 characters'),
	productPriceValidation: check('price')
		.trim()
		.toFloat()
		.isFloat({ min: 0.5 })
		.withMessage('Price must be 0.5 cedi or more'),
};
