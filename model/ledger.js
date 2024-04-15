const mongoose = require('mongoose')

const ledgerSchema = new mongoose.Schema(
  {
    cash_in_hand: {
      type: Number,
    },
    cash_in_out: {
      type: Number,
    },
    online_payment: {
      type: Number,
    },
    cash_payment_in: {
      type: Number,
    },
    product_description: {
      type: String,
    },
    Date: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

const Ledger = mongoose.model('Ledger', ledgerSchema)

module.exports = Ledger
