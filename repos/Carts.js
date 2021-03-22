const Repo = require('./Repository');

class CartRepository extends Repo {}

module.exports = new CartRepository('carts.json');
