const express = require('express')
const router = express.Router()
const orderController = require('../controllers/orderController.js')
const { verifyToken } = require('../middleware/auth')

router.post('/create', verifyToken, orderController.createOrder)
router.post('/checkout', verifyToken, orderController.createCheckout)
// Webhook is handled in app.js with raw body, not here
router.get('/user/:user_id', verifyToken, orderController.getUserOrders)

module.exports = router
