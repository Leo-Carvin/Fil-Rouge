const adminModel = require('../models/adminModel')

exports.getStats = async (req, res) => {
  try {
    const stats = await adminModel.getStats()
    res.json(stats)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await adminModel.findAllOrders()
    res.json(orders)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body
    await adminModel.updateOrderStatus(req.params.id, status)
    res.json({ message: 'Statut mis a jour' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
