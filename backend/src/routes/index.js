const express = require('express')

const adminRoutes = require('./adminRoutes')
const authRoutes = require('./authRoutes')
const buildRoutes = require('./buildRoutes')
const cartRoutes = require('./cartRoutes')
const orderRoutes = require('./orderRoutes')
const productRoutes = require('./productRoutes')

const router = express.Router()

router.use('/admin', adminRoutes)
router.use('/auth', authRoutes)
router.use('/build', buildRoutes)
router.use('/cart', cartRoutes)
router.use('/orders', orderRoutes)
router.use('/products', productRoutes)

module.exports = router
