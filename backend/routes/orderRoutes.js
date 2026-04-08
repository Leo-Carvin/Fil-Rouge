const express = require('express')
const router = express.Router()
const orderController = require('../controllers/orderController.js')
const { verifyToken } = require('../middleware/auth')

router.post('/create', verifyToken, orderController.createOrder)
router.get('/user/:user_id', verifyToken, orderController.getUserOrders)

module.exports = router