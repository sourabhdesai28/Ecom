const mongoose = require('mongoose')

const salesSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    quantitySold: {
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
    sellingPrice: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
)

const Sales = mongoose.model('Sales', salesSchema)
module.exports = Sales
