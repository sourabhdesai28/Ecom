const mongoose = require('mongoose')

const receiveSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    quantityReceived: {
      type: Number,
    },
    brandName: {
      type: String,
      ref: 'Product.brandName',
    },
    productName: {
      type: String,
      ref: 'Product.productName',
    },
    purchaseNumber: {
      type: String,
      ref: 'Product.orderNumber',
    },
    SKU: {
      type: String,
      ref: 'Product.SKU',
    },
    costPrice: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
)

const Receive = mongoose.model('Receive', receiveSchema)
module.exports = Receive
