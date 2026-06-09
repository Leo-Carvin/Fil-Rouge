const cartModel = require('../models/cartModel')

exports.getCart = async (req, res) => {
  try {
    const cart = await cartModel.findByUserId(req.user.id)
    res.json(cart)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.addOrUpdateCartItem = async (req, res) => {
  try {
    const { product_id, quantity } = req.body
    await cartModel.upsertItem(req.user.id, product_id, quantity)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.removeCartItem = async (req, res) => {
  try {
    await cartModel.removeItem(req.user.id, req.params.product_id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.clearCart = async (req, res) => {
  try {
    await cartModel.clear(req.user.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
