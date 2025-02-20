const express = require('express');
const router = express.Router();
const Order = require('../Model/order.model');
const authMiddleware = require('../middleware'); // Assuming middleware is correctly exported

// Create order route
router.post('/orders', authMiddleware, async (req, res) => {
  try {
    const { items, totalAmount, address } = req.body;

    if (!items || !totalAmount || !address) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newOrder = new Order({
      userId: req.userId, 
      items,
      totalAmount,
      address,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully', order: savedOrder });
  } catch (error) {
    console.log('Error placing order:', error); // Debug log
    res.status(500).json({ message: 'Failed to place order', error: error.message });
  }
});

// Get orders route
router.get('/orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).populate('items.productId');
    res.status(200).json(orders);
  } catch (error) {
    console.log('Error fetching orders:', error); // Debug log
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

module.exports = router;
