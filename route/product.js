const express = require('express')
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductByName,
  getProductBySKU,
  search,
  searchProduct,
  getAllSKUAndProductName,
  getAllBrandNames,
  getAllBrandName,
  getOutOfStock,
  getOutOfStocks,
  deleteOneOutOfStocks,
  getAllStockAmount,
} = require('../controller/product')
const Product = require('../model/product')
const router = express.Router()

//ADD PRODUCT
router.post('/add', createProduct)

//GET ALL PRODUCTS
router.get('/all', getAllProducts)

//GET PRODUCT BY BRAND NAME
router.get('/:brandName', getProductByName)

//GET PRODUCT BY SKU
router.get('/sku/:sku', getProductBySKU)

//GET SINGLE PRODUCT
router.get('/get/:id', getProductById)

//UPDATES PRODUCT
router.put('/:id', updateProduct)

//DELETE PRODUCT
router.delete('/:id', deleteProduct)

//SEARCH PRODUCT
router.get('/search/gl', async (req, res, next) => {
  try {
    const { query } = req.query

    // Convert the array to a string by joining its elements
    const queryString = query.join(' ')

    console.log('Received query:', queryString)

    const results = await Product.find({
      $or: [
        { productName: { $regex: queryString, $options: 'i' } },
        { brandName: { $regex: queryString, $options: 'i' } },
        { SKU: { $regex: queryString, $options: 'i' } },
        { orderNumber: { $regex: queryString, $options: 'i' } },
      ],
    })

    console.log('Search results:', results)
    res.json(results)
  } catch (error) {
    console.error('Error:', error)
    next(error)
  }
})

//SEARCH PRODUCTS GLOBALLY
router.get('/search/globally', async (req, res, next) => {
  try {
    const { productName, brandName, SKU } = req.query

    const conditions = {}

    if (productName) {
      conditions.productName = { $regex: productName, $options: 'i' }
    }

    if (brandName) {
      conditions.brandName = { $regex: brandName, $options: 'i' }
    }

    if (SKU) {
      conditions.SKU = { $regex: SKU, $options: 'i' }
    }

    const results = await Product.find(
      Object.keys(conditions).length > 0 ? conditions : {},
    )

    res.status(200).json({ data: results })
  } catch (error) {
    next(error)
  }
})

router.get('/sku/brandName/sku', getAllSKUAndProductName)

router.get('/allBrand/brand', getAllBrandName)

router.get('/out/stock', getOutOfStock)

router.get('/allStock/out', getOutOfStocks)

router.delete('/outofStock/:id', deleteOneOutOfStocks)

router.get('/total/Amount', getAllStockAmount)

module.exports = router
