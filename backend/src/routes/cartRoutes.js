const express = require('express')
const cartController = require('../controllers/cartController')
const { verifyToken } = require('../middleware/auth')

const router = express.Router()

router.get('/', verifyToken, cartController.getCart)
router.post('/', verifyToken, cartController.addOrUpdateCartItem)
router.delete('/:product_id', verifyToken, cartController.removeCartItem)
router.delete('/', verifyToken, cartController.clearCart)

module.exports = router
