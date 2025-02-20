const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products with pagination, sorting and search
router.get('/', async (req, res) => {
  try {
    // Pagination parameters
    const page = parseInt(req?.query?.page) || 1;
    const size = parseInt(req?.query?.size) || 5;
    const skip = (page - 1) * size;

    // Search parameters
    const searchQuery = req?.query?.search || '';
    const searchRegex = new RegExp(searchQuery, 'i');

    // Create search filter
    const filter = searchQuery
      ? {
          $or: [
            { name: searchRegex },
            { description: searchRegex }
          ]
        }
      : {};

    // Get total count for pagination
    const totalCount = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / size);

    // Get products with pagination and sorting
    const products = await Product.find(filter)
      .sort({ _id: -1 }) // Sort by newest first
      .skip(skip)
      .limit(size);

    res.json({
      rows: products,
      pagination: {
        currentPage: page,
        totalPages,
        pageSize: size,
        totalCount
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new product
router.post('/', async (req, res) => {
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    remain: req.body.remain,
    description: req.body.description
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update product
router.patch('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (req.body.name != null) {
      product.name = req.body.name;
    }
    if (req.body.price != null) {
      product.price = req.body.price;
    }
    if (req.body.remain != null) {
      product.remain = req.body.remain;
    }
    if (req.body.description != null) {
      product.description = req.body.description;
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const result = await Product.findByIdAndDelete(req?.params?.id);
    if (!result) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(204).json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;