const orderModel = require('../models/orderModel')
const productModel = require('../models/productModel')
const userModel = require('../models/userModel')
const { sendOrderConfirmation } = require('../services/mailer')

exports.createOrder = async (req, res) => {
  try {
    const { user_id, items } = req.body
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const orderId = await orderModel.create({ userId: user_id, total })

    for (const item of items) {
      await orderModel.addItem(orderId, item)
    }

    const userEmail = await userModel.findEmailById(user_id)
    const itemsWithNames = await Promise.all(items.map(async (item) => ({
      ...item,
      name: await productModel.findNameById(item.product_id) || 'Produit'
    })))

    if (userEmail) {
      await sendOrderConfirmation(userEmail, orderId, itemsWithNames, total)
    }

    res.json({ message: 'Commande creee', orderId })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await orderModel.findByUserId(req.params.user_id)
    res.json(orders)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
