const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    subscriptionStartDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

const Admin = mongoose.model('Admin', adminSchema)
module.exports = Admin
