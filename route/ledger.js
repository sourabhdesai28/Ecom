const express = require('express')
const {
  getAllLedger,
  addLedger,
  updateLedger,
  deleteLedger,
  getLedgerById,
} = require('../controller/ledger')
const router = express.Router()

router.get('/', getAllLedger)

router.post('/add', addLedger)

router.get('/:id', getLedgerById)

router.put('/:id', updateLedger)

router.delete('/:id', deleteLedger)

module.exports = router
