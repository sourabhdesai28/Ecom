const Ledger = require('../model/ledger')
const Product = require('../model/product')
const Sales = require('../model/sales')

exports.sellProduct = async (req, res, next) => {
  try {
    const salesData = req.body.salesData

    if (!Array.isArray(salesData) || salesData.length === 0) {
      return res.status(400).json({ error: 'Invalid sales data format' })
    }

    let totalSoldPrice = 0

    for (const { productId, quantitySold, sellingPrice } of salesData) {
      const product = await Product.findById(productId)

      if (!product) {
        return res
          .status(404)
          .json({ error: `Product with ID ${product.productName} not found` })
      }

      const parsedQuantitySold = parseInt(quantitySold)
      const parsedSellingPrice = parseFloat(sellingPrice)

      if (
        isNaN(parsedQuantitySold) ||
        parsedQuantitySold <= 0 ||
        isNaN(parsedSellingPrice) ||
        parsedSellingPrice <= 0
      ) {
        return res.status(400).json({
          error: `Invalid quantity sold or selling price for product with ID ${product.productName}`,
        })
      }

      if (parseInt(product.quantity) < parsedQuantitySold) {
        return res.status(400).json({
          error: `Insufficient quantity available for product with ID ${product.productName}`,
        })
      }

      totalSoldPrice += parsedQuantitySold * parsedSellingPrice

      const parsedQuantity = parseInt(product.quantity)
      const updatedQuantity = parsedQuantity - parsedQuantitySold

      await Product.findByIdAndUpdate(productId, {
        quantity: updatedQuantity.toString(),
      })

      const sale = new Sales({
        product: productId,
        quantitySold: parsedQuantitySold,
        brandName: product.brandName,
        productName: product.productName,
        purchaseNumber: product.orderNumber,
        SKU: product.SKU,
        sellingPrice: parsedSellingPrice,
      })

      await sale.save()
    }

    res.status(200).json({ message: 'Products sold successfully' })
  } catch (error) {
    next(error)
  }
}

exports.getSoldProductsCount = async (req, res) => {
  try {
    const soldProductsCount = await Sales.countDocuments({})
    res.status(200).json({ soldProductsCount })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

exports.getSoldProductsList = async (req, res, next) => {
  try {
    const soldProducts = await Sales.find().populate('product')

    const productsList = soldProducts.map((sale) => {
      if (sale.product) {
        return {
          productId: sale.product._id,
          productName: sale.product.productName,
          quantitySold: sale.quantitySold,
        }
      } else {
        return {
          productId: null,
          productName: 'N/A',
          quantitySold: sale.quantitySold,
        }
      }
    })

    res.status(200).json({ soldProducts: productsList })
  } catch (error) {
    next(error)
  }
}

exports.getTotalSale = async (req, res, next) => {
  try {
    const getTotal = await Sales.find()
    res.status(200).json({
      data: getTotal,
    })
  } catch (error) {
    next(error)
  }
}

exports.searchSales = async (req, res, next) => {
  try {
    const searchTerm = req.query.searchTerm

    const query = {}

    if (searchTerm) {
      query.$or = [
        { productName: { $regex: new RegExp(searchTerm, 'i') } },
        { brandName: { $regex: new RegExp(searchTerm, 'i') } },
        { SKU: { $regex: new RegExp(searchTerm, 'i') } },
      ]
    }

    const sortOptions = { createdAt: -1 }

    const salesData =
      Object.keys(query).length === 0
        ? await Sales.find().sort(sortOptions)
        : await Sales.find(query).sort(sortOptions)

    res.status(200).json({ data: salesData })
  } catch (error) {
    next(error)
  }
}

// exports.getTotalAmountOfSales = async (req, res, next) => {
//   try {
//     const result = await Sales.aggregate([
//       {
//         $group: {
//           _id: { $month: '$createdAt' },
//           totalAmount: { $sum: '$sellingPrice' },
//         },
//       },
//     ])

//     res.json(result)
//   } catch (error) {
//     next(error)
//   }
// }

exports.getTotalAmountOfSales = async (req, res, next) => {
  try {
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth() + 1

    const result = await Sales.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: '$createdAt' }, currentMonth],
          },
        },
      },
      {
        $group: {
          _id: null,
          month: {
            $first: { $dateToString: { format: '%m', date: '$createdAt' } },
          },
          totalAmount: { $sum: '$sellingPrice' },
        },
      },
    ])

    res.json(result)
  } catch (error) {
    next(error)
  }
}
