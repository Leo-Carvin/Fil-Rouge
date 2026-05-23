const db = require('../config/db')

exports.getStats = async (req, res) => {
  try {
    const r1 = await db.query("SELECT COUNT(*) as total_orders FROM orders")
    const r2 = await db.query("SELECT COALESCE(SUM(total_price), 0) as revenue FROM orders")
    const r3 = await db.query("SELECT COUNT(*) as total_users FROM users")
    const r4 = await db.query("SELECT COUNT(*) as total_products FROM products")
    res.json({
      total_orders: r1.rows[0].total_orders,
      revenue: r2.rows[0].revenue,
      total_users: r3.rows[0].total_users,
      total_products: r4.rows[0].total_products
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.getAllOrders = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT o.id, o.total_price, o.created_at, o.status,
      u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `)
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body
    await db.query("UPDATE orders SET status = $1 WHERE id = $2", [status, req.params.id])
    res.json({ message: 'Statut mis à jour' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}