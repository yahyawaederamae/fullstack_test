const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('products.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('products.product');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create order
router.post('/', async (req, res) => {
  const session = await Order.startSession();
  session.startTransaction();

  try {
    const { products, customerName, phoneNumber, address, totalAmount } = req.body;

    // Check product availability and update stock
    for (let item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new Error(`Product ${item.product} not found`);
      }
      if (product.remain < item.quantity) {
        throw new Error(`Insufficient stock for product ${product.name}`);
      }
      
      // Update product stock
      product.remain -= item.quantity;
      await product.save({ session });
    }

    const order = new Order({
      products,
      customerName,
      phoneNumber,
      address,
      totalAmount
    });

    await order.save({ session });
    await session.commitTransaction();
    
    res.status(201).json(order);
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ message: err.message });
  } finally {
    session.endSession();
  }
});

// Update order
router.patch('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    Object.assign(order, req.body);
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
    console.log("Delete Order");
    try {
      const result = await Order.findByIdAndDelete(req?.params?.id);
      res.status(204).json(result);
    } catch (error) {
      res.status(404).json({ err: error });
    }
  });

module.exports = router;