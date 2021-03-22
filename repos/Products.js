const Repository = require('./Repository');

class ProductsRepo extends Repository {}

module.exports = new ProductsRepo('products.json');
