const express = require('express');
const productsRepo = require('../../repos/Products');
const productsForAllUsersView = require('../../frontend/allusers/ProductsList');
const router = express.Router();

router.get('/', async (req, res) => {
	const products = await productsRepo.getAll();

	res.send(productsForAllUsersView({ products }));
});

module.exports = router;
