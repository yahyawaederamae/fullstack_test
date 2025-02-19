const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  products: [
    {
      product: { 
        type: mongoose.Types.ObjectId, 
        ref: 'Product' 
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      }
    }
  ],
  customerName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;