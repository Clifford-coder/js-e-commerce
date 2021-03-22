const express = require('express');
const multer = require('multer');

const { handleErrors, requireAuth } = require('./middlewares');
const { productPriceValidation, productTitleValidation } = require('../../routes/admin/validations');
const productsRepo = require('../../repos/Products');
const newProductsFormView = require('../../frontend/admin/products/new');
const productListView = require('../../frontend/admin/products/productsList');
const editProductView = require('../../frontend/admin/products/editProduct');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/admin/products', requireAuth, async (req, res) => {
	const products = await productsRepo.getAll();
	res.send(productListView({ products }));
});

router.get('/admin/products/new', requireAuth, (req, res) => {
	res.send(newProductsFormView({}));
});

router.post(
	'/admin/products/new',
	requireAuth,
	upload.single('image'),
	[productTitleValidation, productPriceValidation],
	handleErrors(newProductsFormView),
	async (req, res) => {
		const image = req.file.buffer.toString('base64');
		const { title, price } = req.body;
		await productsRepo.create({ title, price, image });
		res.redirect('/admin/products');
	}
);

router.get('/admin/products/:id/edit', requireAuth, async (req, res) => {
	const product = await productsRepo.getOne(req.params.id);

	if (!product) {
		return res.send('Product not found');
	}

	res.send(editProductView({ product }));
});

router.post(
	'/admin/products/:id/edit',
	requireAuth,
	upload.single('image'),
	[productTitleValidation, productPriceValidation],
	handleErrors(editProductView, async (req) => {
		const product = await productsRepo.getOne(req.params.id);
		return { product };
	}),
	async (req, res) => {
		const changes = req.body;

		//check if an image was uploaded.
		if (req.file) {
			changes.image = req.file.buffer.toString('base64');
		}
		try {
			await productsRepo.update(req.params.id, changes);
		} catch (err) {
			return res.send('Product not found!!');
		}
		res.redirect('/admin/products');
	}
);

router.post('/admin/products/:id/delete', requireAuth, async (req, res) => {
	await productsRepo.delete(req.params.id);
	res.redirect('/admin/products');
});

module.exports = router;
