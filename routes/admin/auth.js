const express = require('express');

const usersRepo = require('../../repos/Users');
const { handleErrors } = require('./middlewares');
const signUpView = require('../../frontend/admin/auth/signup');
const signInView = require('../../frontend/admin/auth/signin');
const {
	emailValidation,
	passwordValidation,
	passwordConfirmationValidation,
	emailExistsValidation,
	correctPassword,
} = require('./validations');

//create sub-router
const router = express.Router();

//create a route handler to tell this web server what it should do whenever a req is made by the browser
router.get('/signup', (req, res) => {
	res.send(signUpView({ req }));
});

router.post(
	'/signup',
	[emailValidation, passwordValidation, passwordConfirmationValidation],
	handleErrors(signUpView),
	async (req, res) => {
		const { email, password } = req.body;

		//create a user
		const user = await usersRepo.create({ email, password });

		//store the id of the user inside the user's cookie
		req.session.userId = user.id;
		res.redirect('/admin/products');
	}
);

router.get('/signout', (req, res) => {
	req.session = null;
	res.send('You logged out');
});

router.get('/signin', (req, res) => {
	res.send(signInView({}));
});

router.post('/signin', [emailExistsValidation, correctPassword], handleErrors(signInView), async (req, res) => {
	const { email } = req.body;

	//check if there is an existing user with the provided email
	const user = await usersRepo.getOneBy({ email });

	//save the user id to the cookies
	req.session.userId = user.id;

	res.redirect('/admin/products');
});

module.exports = router; //to make the route available to other files
