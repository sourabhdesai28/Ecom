const express = require('express')
const controller = require('../controller/receive')
const Receive = require('../model/receive')
const router = express.Router()

router.post('/add', controller.addProduct)

router.get('/received-products', async (req, res, next) => {
  try {
    const receivedProducts = await Receive.find({})
      .populate('product')
      .select('product')

    const uniqueProducts = [
      ...new Set(receivedProducts.map((item) => item.product)),
    ]

    res.status(200).json({
      data: uniqueProducts,
    })
  } catch (error) {
    next(error)
  }
})

router.get('/search/all/query', controller.searchRec)

router.get('/totalRec/amount', controller.getTotalAmountPerMonth)

module.exports = router
