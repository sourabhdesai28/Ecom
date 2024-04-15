const Ledger = require('../model/ledger')
const Product = require('../model/product')
const Receive = require('../model/receive')

exports.addProduct = async (req, res, next) => {
  try {
    const addData = req.body.addData

    if (!Array.isArray(addData) || addData.length === 0) {
      return res.status(400).json({ error: 'Invalid sales data format' })
    }

    let totalCost = 0

    for (const { productId, quantityReceived, costPrice } of addData) {
      const product = await Product.findById(productId)

      if (!product) {
        return res
          .status(404)
          .json({ error: `Product with ID ${productId} not found` })
      }

      const parsedQuantityReceived = parseInt(quantityReceived)
      const parsedCostPrice = parseFloat(costPrice)

      if (
        isNaN(parsedQuantityReceived) ||
        parsedQuantityReceived <= 0 ||
        isNaN(parsedCostPrice) ||
        parsedCostPrice <= 0
      ) {
        return res.status(400).json({
          error: `Invalid quantity received or cost price for product with ID ${productId}`,
        })
      }

      totalCost += parsedQuantityReceived * parsedCostPrice

      const parsedQuantity = parseInt(product.quantity)
      const updatedQuantity = parsedQuantity + parsedQuantityReceived

      await Product.findByIdAndUpdate(productId, {
        quantity: updatedQuantity.toString(),
      })

      const receive = new Receive({
        product: productId,
        quantityReceived: parsedQuantityReceived,
        brandName: product.brandName,
        productName: product.productName,
        purchaseNumber: product.orderNumber,
        SKU: product.SKU,
        costPrice: parsedCostPrice,
      })

      await receive.save()
    }

    res.status(200).json({ message: 'Products received successfully' })
  } catch (error) {
    next(error)
  }
}

exports.searchRec = async (req, res, next) => {
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
        ? await Receive.find().sort(sortOptions)
        : await Receive.find(query).sort(sortOptions)

    res.status(200).json({ data: salesData })
  } catch (error) {
    next(error)
  }
}

exports.getTotalAmountPerMonth = async (req, res, next) => {
  try {
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth() + 1
    const result = await Receive.aggregate([
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
          totalAmount: { $sum: '$costPrice' },
        },
      },
    ])

    res.status(200).json({ data: result })
  } catch (error) {
    next(error)
  }
}
