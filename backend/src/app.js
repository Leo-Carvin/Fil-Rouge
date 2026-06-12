const express = require('express')
const cors = require('cors')
const routes = require('./routes')
const orderController = require('./controllers/orderController')

const app = express()

app.use(cors())

// Stripe webhook needs raw body for signature verification
app.use('/orders/webhook', express.raw({ type: 'application/json' }), orderController.stripeWebhook)

// Regular JSON parsing for all other routes
app.use(express.json())

app.get('/', (req, res) => {
  res.send('API PCSTORE fonctionne')
})

app.use(routes)

module.exports = app
