
const cartController = require('../Controller/cart.controller.js');
const express = require('express');
const cartRouter = express.Router();

cartRouter.post('/', cartController.cart);
cartRouter.get('/:userId', cartController.getCart);
cartRouter.delete('/', cartController.deleteCart);
module.exports = cartRouter;
