const db = require('../config/db')

async function create({ userId, total }) {
  const result = await db.query(
    "INSERT INTO orders (user_id, total_price, status) VALUES ($1, $2, 'pending') RETURNING id",
    [userId, total]
  )
  return result.rows[0].id
}

async function addItem(orderId, item) {
  await db.query(
    'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
    [orderId, item.product_id, item.quantity, item.price]
  )
}

async function findByUserId(userId) {
  const orders = await db.query(
    'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  )

  for (const order of orders.rows) {
    const items = await db.query(
      `SELECT oi.*, p.name, p.image FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [order.id]
    )
    order.items = items.rows
  }

  return orders.rows
}

module.exports = {
  addItem,
  create,
  findByUserId
}
