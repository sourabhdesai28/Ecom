const express = require('express')

const router = express.Router()

const controller = require('../controller/sales')

router.post('/sell', controller.sellProduct)

router.get('/TotalSold', controller.getSoldProductsCount)

router.get('/totalSold/List', controller.getSoldProductsList)

router.get('/getTotal', controller.getTotalSale)

router.get('/total/search', controller.searchSales)

router.get('/totalsold/amount', controller.getTotalAmountOfSales)

module.exports = router
