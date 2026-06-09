const db = require('../config/db')

async function findByUserId(userId) {
  const result = await db.query(
    `SELECT ci.id, ci.quantity, p.id as product_id, p.name, p.price, p.type, p.image, p.socket, p.ram_type
     FROM cart_items ci
     JOIN products p ON ci.product_id = p.id
     WHERE ci.user_id = $1`,
    [userId]
  )
  return result.rows
}

async function upsertItem(userId, productId, quantity) {
  const existing = await db.query(
    'SELECT id FROM cart_items WHERE user_id = $1 AND product_id = $2',
    [userId, productId]
  )

  if (existing.rows.length > 0) {
    await db.query(
      'UPDATE cart_items SET quantity = $1 WHERE user_id = $2 AND product_id = $3',
      [quantity, userId, productId]
    )
    return
  }

  await db.query(
    'INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3)',
    [userId, productId, quantity]
  )
}

async function removeItem(userId, productId) {
  await db.query(
    'DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2',
    [userId, productId]
  )
}

async function clear(userId) {
  await db.query('DELETE FROM cart_items WHERE user_id = $1', [userId])
}

module.exports = {
  clear,
  findByUserId,
  removeItem,
  upsertItem
}
