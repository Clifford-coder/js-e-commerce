const express = require('express');
const router = express.Router();
const CartsRepo = require('../../repos/Carts');
const ProductRepo = require('../../repos/Products');
const showCart = require('../../frontend/allusers/showCart');

//Receive a post request to add items to cart.
router.post('/mycart/products', async (req, res) => {
	let cart;
	// check for an existing cart for the user.
	if (!req.session.cartId) {
		//create a cart for this user
		cart = await CartsRepo.create({ items: [] });
		req.session.cartId = cart.id; //assign this cart in a cookie form to this particular user.
	} else {
		//get the user's cart for him.
		cart = await CartsRepo.getOne(req.session.cartId);
	}

	//adding items to cart
	//check for existing items
	const existingItem = cart.items.find((item) => item.id === req.body.productId);
	if (existingItem) existingItem.quantity++;
	else cart.items.push({ id: req.body.productId, quantity: 1 });

	await CartsRepo.update(cart.id, {
		items: cart.items,
	});

	res.redirect('/mycart');
});

//Receive a get request to show all the items in cart.
router.get('/mycart', async (req, res) => {
	//check for existing cart
	if (!req.session.cartId) {
		return res.redirect('/');
	}

	const cart = await CartsRepo.getOne(req.session.cartId);

	for (let item of cart.items) {
		const product = await ProductRepo.getOne(item.id);
		item.product = product;
	}
	res.send(showCart({ items: cart.items }));
});

//Receive a post request to delete an item
router.post('/mycart/products/delete', async (req, res) => {
	const { cartItemId } = req.body;
	const cart = await CartsRepo.getOne(req.session.cartId);

	const items = cart.items.filter((item) => item.id !== cartItemId);

	await CartsRepo.update(req.session.cartId, { items });

	res.redirect('/mycart');

	// CartsRepo.delete(req.body.cartItemId);
});

module.exports = router;
