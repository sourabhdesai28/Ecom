const express = require('express')

const bodyParser = require('body-parser')

const cors = require('cors')
const { dbConnection } = require('./config/db.config')

require('dotenv').config()
const port = process.env.PORT

const app = express()

app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('Welcome to Jai Ambey Enterprises!')
})

app.use('/api/user', require('./route/user'))

app.use('/api/product', require('./route/product'))

app.use('/api/sale', require('./route/sales'))

app.use('/api/receive', require('./route/receive'))

app.use('/api/ledger', require('./route/ledger'))

app.listen(port, async () => {
  console.log('server listening on port', port)
  dbConnection()
})
