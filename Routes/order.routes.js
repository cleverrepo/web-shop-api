const express = require('express');
const router = express.Router();
const Order = require('../Model/order.model.js'); 
const User = require('../Model/user.model.js'); 
const adminAuthMiddleware = require('../midleware.js'); 

router.get('/admin/orders', adminAuthMiddleware, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email') 
      .populate('items.productId', 'name price'); 

    res.status(200).json({ message: 'Orders fetched successfully', orders });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error });
  }
});

module.exports = router;
