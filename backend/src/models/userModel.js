const db = require('../config/db')

async function findByEmail(email) {
  const result = await db.query('SELECT * FROM users WHERE email=$1', [email])
  return result.rows[0]
}

async function existsByEmail(email) {
  const result = await db.query('SELECT id FROM users WHERE email=$1', [email])
  return result.rows.length > 0
}

async function create({ email, password }) {
  await db.query(
    'INSERT INTO users (email, password) VALUES ($1, $2)',
    [email, password]
  )
}

async function findEmailById(id) {
  const result = await db.query('SELECT email FROM users WHERE id = $1', [id])
  return result.rows[0]?.email
}

async function deleteAccount(userId) {
  await db.query('DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE user_id=$1)', [userId])
  await db.query('DELETE FROM orders WHERE user_id=$1', [userId])
  await db.query('DELETE FROM pc_build_components WHERE pc_build_id IN (SELECT id FROM pc_builds WHERE user_id=$1)', [userId])
  await db.query('DELETE FROM pc_builds WHERE user_id=$1', [userId])
  await db.query('DELETE FROM users WHERE id=$1', [userId])
}

module.exports = {
  create,
  deleteAccount,
  existsByEmail,
  findByEmail,
  findEmailById
}
