const db = require('../config/db')

exports.getStats = async (req, res) => {
  try {
    const [[{ total_orders }]] = await db.query("SELECT COUNT(*) as total_orders FROM orders")
    const [[{ revenue }]] = await db.query("SELECT COALESCE(SUM(total_price), 0) as revenue FROM orders")
    const [[{ total_users }]] = await db.query("SELECT COUNT(*) as total_users FROM users")
    const [[{ total_products }]] = await db.query("SELECT COUNT(*) as total_products FROM products")
    res.json({ total_orders, revenue, total_users, total_products })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.getAllOrders = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT o.id, o.total_price, o.created_at, o.status,
             u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `)
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body
    await db.query("UPDATE orders SET status = ? WHERE id = ?", [status, req.params.id])
    res.json({ message: 'Statut mis à jour' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}