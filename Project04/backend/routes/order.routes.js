const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");

// Define base pipeline for reuse
const pipeline = [
  // Join with users collection
  {
    $lookup: {
      from: "users",
      localField: "user",
      foreignField: "_id",
      as: "user",
    },
  },
  // Convert user array to object
  {
    $set: {
      user: { $arrayElemAt: ["$user", 0] },
    },
  },
  // Join with products collection
  {
    $lookup: {
      from: "products",
      localField: "products.product",
      foreignField: "_id",
      as: "product_array",
    },
  },
  // Merge product details with quantities
  {
    $addFields: {
      products: {
        $map: {
          input: "$products",
          as: "inside_product",
          in: {
            $mergeObjects: [
              "$$inside_product",
              {
                product: {
                  $arrayElemAt: [
                    "$product_array",
                    {
                      $indexOfArray: [
                        "$product_array._id",
                        "$$inside_product.product",
                      ],
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    },
  },
  // Remove temporary product array
  {
    $project: {
      product_array: 0,
    },
  },
];

// Pipeline for finding single order by ID
const findOnePipeline = (id) => [
  {
    $match: {
      _id: new mongoose.Types.ObjectId(id),
    },
  },
  ...pipeline,
];

// Get all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.aggregate(pipeline);
    res.json({ rows: orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single order
router.get("/:id", async (req, res) => {
  try {
    const result = await Order.aggregate(findOnePipeline(req.params.id));
    if (!result[0]) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  // Start a transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check and update product stock
    for (const item of req.body.products) {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new Error(`Product ${item.product} not found`);
      }
      if (product.remain < item.quantity) {
        throw new Error(`Insufficient stock for product ${product.name}`);
      }

      // Decrease product stock
      product.remain -= item.quantity;
      await product.save({ session });
    }

    // Create order
    const order = new Order({
      date: new Date(),
      products: req.body.products,
      user: req.body.user,
      customerName: req.body.customerName,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      totalAmount: req.body.totalAmount,
    });

    await order.save({ session });

    await session.commitTransaction();

    const result = await Order.aggregate(findOnePipeline(order._id));
    res.status(201).json(result[0]);
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
});

// Update order
router.patch("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    Object.assign(order, req.body);
    await order.save();

    const result = await Order.aggregate(findOnePipeline(req.params.id));
    res.json(result[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete order
router.delete("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    await Order.deleteOne({ _id: req.params.id });
    res.json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
