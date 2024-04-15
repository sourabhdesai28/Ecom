const { response } = require('express')
const Product = require('../model/product')
const { generateOrderNumber } = require('../utils/helper')

exports.createProduct = async (req, res, next) => {
  try {
    const orderNumber = generateOrderNumber()
    const {
      productName,
      brandName,
      quantity,
      description,
      sellingPrice,
      dimension,
      weight,
      color,
      SKU,
      costPrice,
    } = req.body

    const existingProduct = await Product.findOne({ productName })

    if (existingProduct) {
      return res.status(400).json({
        error: `Product with the name '${productName}' already exists.`,
      })
    }

    const newProductData = {
      productName,
      brandName,
      quantity,
      description,
      sellingPrice,
      dimension,
      weight,
      color,
      SKU,
      orderNumber,
      costPrice,
    }

    const newProduct = new Product(newProductData)
    const validationError = newProduct.validateSync()

    if (validationError) {
      return res.status(400).json({ error: validationError.message })
    }

    const createdProduct = await newProduct.save()

    res.status(201).json({
      success: true,
      message: 'Product created successfully!',
      product: createdProduct,
    })
  } catch (error) {
    next(error)
  }
}

exports.getAllProducts = async (req, res, next) => {
  try {
    const getProducts = await Product.find()

    if (!getProducts || getProducts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Products not found',
      })
    }

    res.status(200).json({
      success: true,
      products: getProducts,
    })
  } catch (error) {
    next(error)
  }
}

exports.getProductById = async (req, res, next) => {
  try {
    const productId = req.params.id
    const getAProduct = await Product.findById(productId)

    if (!getAProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    res.status(200).json({
      success: true,
      product: getAProduct,
    })
  } catch (error) {
    next(error)
  }
}

exports.getProductByName = async (req, res, next) => {
  try {
    const brandname = req.params.brandName
    const getAProduct = await Product.findOne({ brandName: brandname })

    if (!getAProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    res.status(200).json({
      success: true,
      product: getAProduct,
    })
  } catch (error) {
    next(error)
  }
}

exports.getProductBySKU = async (req, res, next) => {
  try {
    const sku = req.params.sku
    console.log('sku', sku)
    const getAProduct = await Product.findOne({
      SKU: sku,
    })

    if (!getAProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }
    res.status(200).json({
      success: true,
      product: getAProduct,
    })
  } catch (error) {
    next(error)
  }
}

exports.updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id
    const updateProduct = await Product.findByIdAndUpdate(productId, req.body, {
      new: true,
    })

    if (!updateProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }
    await updateProduct.save()
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updateProduct,
    })
  } catch (error) {
    next(error)
  }
}

exports.deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.id
    const deleteProduct = await Product.findByIdAndDelete(productId)

    if (!deleteProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}

exports.getAllSKUAndProductName = async (req, res, next) => {
  try {
    const products = await Product.find({}, { SKU: 1, _id: 0 })

    products.forEach((product) => {
      console.log(`SKU: ${product.SKU}`)
    })

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No products found',
      })
    }

    res.status(200).json({
      success: true,
      data: products.map((product) => ({ SKU: product.SKU })),
    })
  } catch (error) {
    console.error('Error:', error)
    next(error)
  }
}

exports.getAllBrandName = async (req, res, next) => {
  try {
    const brandNames = await Product.distinct('brandName')

    res.status(200).json({
      data: brandNames,
    })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

exports.getOutOfStock = async (req, res, next) => {
  try {
    const outOfStockProducts = await Product.countDocuments({ quantity: '5' })

    res.status(200).json({ outOfStockProducts })
  } catch (error) {
    next(error)
  }
}

exports.getOutOfStocks = async (req, res, next) => {
  try {
    const outOfStockProducts = await Product.find(
      { quantity: { $lt: 6 } },
      'quantity brandName productName SKU description sellingPrice dimension weight color orderNumber',
    )

    res.status(200).json({ outOfStockProducts })
  } catch (error) {
    next(error)
  }
}

exports.deleteOneOutOfStocks = async (req, res, next) => {
  const productId = req.params.id

  try {
    const removedProduct = await Product.findOneAndDelete({
      _id: productId,
      quantity: { $lt: 6 },
    })

    if (removedProduct) {
      res.status(200).json({
        message: 'Out-of-stock product removed successfully',
        removedProduct,
      })
    } else {
      res.status(404).json({ message: 'Product not found or not out of stock' })
    }
  } catch (error) {
    next(error)
  }
}

exports.getAllStockAmount = async (req, res) => {
  try {
    const products = await Product.find()
    const totalAmount = products.reduce(
      (acc, product) => acc + (product.costPrice || 0),
      0,
    )
    res.json({ totalAmount })
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
