const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');

const authRouter = require('./routes/admin/auth.js');
const adminProductRouter = require('./routes/admin/products.js');
const allusersProductRouter = require('./routes/allusers/productsList');
const cartsRouter = require('./routes/allusers/carts');

const app = express();

//make the public folder available to the outside would in order to use the css.
app.use(express.static('public'));
//Wire up the bodyParser middleware globally the entire app for all the route handlers for forms
app.use(bodyParser.urlencoded({ extended: true }));

//wire up cookie-session globally in the application
app.use(
	cookieSession({
		keys: ['sdfhfjkhgytv9reti549t42512402342394-049234'],
	})
);

app.use(authRouter); //to get access to all the routes in the admin/auth.js
app.use(adminProductRouter); //to get access to all the routes in the admin/products
app.use(allusersProductRouter); //to get access to all the routes in the allusers/productsList
app.use(cartsRouter);

app.listen(7777, () => {
	console.log('Listening........');
});
