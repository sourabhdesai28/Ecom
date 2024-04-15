const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      unique: true,
    },
    brandName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    sellingPrice: {
      type: Number,
    },
    costPrice: {
      type: Number,
    },
    dimension: {
      type: {
        length: {
          type: Number,
        },
        breadth: {
          type: Number,
        },
        height: {
          type: Number,
        },
        unit: {
          type: String,
        },
      },
    },
    weight: {
      type: {
        value: {
          type: Number,
        },
        unit: {
          type: String,
        },
      },
    },
    color: {
      type: String,
    },
    SKU: {
      type: String,
      default: 'N/A',
    },
    orderNumber: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
)

const Product = mongoose.model('Product', productSchema)
module.exports = Product
