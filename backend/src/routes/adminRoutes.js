const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
const { verifyToken, verifyAdmin } = require('../middleware/auth')

router.get('/stats', verifyToken, verifyAdmin, adminController.getStats)
router.get('/orders', verifyToken, verifyAdmin, adminController.getAllOrders)
router.put('/orders/:id/status', verifyToken, verifyAdmin, adminController.updateOrderStatus)

module.exports = router