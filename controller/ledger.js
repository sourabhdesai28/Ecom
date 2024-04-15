const Ledger = require('../model/ledger')

exports.getAllLedger = async (req, res, next) => {
  try {
    const getAll = await Ledger.find()
    res.status(200).json({
      getAll,
    })
  } catch (error) {
    next(error)
  }
}

exports.addLedger = async (req, res, next) => {
  try {
    const createledger = req.body
    const ledger = await Ledger.create(createledger)
    if (!ledger) {
      res.status(404).json({
        message: 'invalid ledger',
      })
    }
    res.status(200).json({
      data: ledger,
    })
  } catch (error) {
    next(error)
  }
}

exports.updateLedger = async (req, res, next) => {
  try {
    const ledgerId = req.params.id
    const ledger = await Ledger.findByIdAndUpdate(ledgerId, req.body, {
      new: true,
    })
    if (!ledger) {
      res.status(404).send({ message: 'Ledger not found' })
    }

    await ledger.save()

    res.status(200).send({ message: 'Ledger updated successfully' })
  } catch (error) {
    next(error)
  }
}

exports.deleteLedger = async (req, res, next) => {
  try {
    const ledgerId = req.params.id
    const ledger = await Ledger.findByIdAndDelete(ledgerId)

    if (!ledger) {
      res.status(404).send({ message: 'Ledger not found' })
    }

    await ledger.deleteOne()

    res.status(200).send({ message: 'Ledger deleted successfully' })
  } catch (error) {
    next(error)
  }
}

exports.getLedgerById = async (req, res, next) => {
  try {
    const ledgerId = req.params.id
    if (ledgerId) {
      const ledger = await Ledger.findById(ledgerId)
      res.status(200).json({
        message: 'ledger fetched successfully',
        data: ledger,
      })
    }
    res.status(404).json({
      message: 'ledger not found',
    })
  } catch (error) {
    next(error)
  }
}
