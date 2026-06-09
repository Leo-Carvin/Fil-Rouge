const db = require('../config/db')

async function findAll({ type, search, sort } = {}) {
  let query = 'SELECT * FROM products WHERE 1=1'
  const params = []
  let i = 1

  if (type && type !== 'All') {
    query += ` AND UPPER(type) = $${i++}`
    params.push(type.toUpperCase())
  }

  if (search) {
    query += ` AND (UPPER(name) LIKE $${i++} OR UPPER(description) LIKE $${i++})`
    params.push(`%${search.toUpperCase()}%`)
    params.push(`%${search.toUpperCase()}%`)
  }

  if (sort === 'price_asc') query += ' ORDER BY price ASC'
  else if (sort === 'price_desc') query += ' ORDER BY price DESC'
  else query += ' ORDER BY id DESC'

  const result = await db.query(query, params)
  return result.rows
}

async function updateById(id, { name, price, stock, description }) {
  await db.query(
    'UPDATE products SET name=$1, price=$2, stock=$3, description=$4 WHERE id=$5',
    [name, price, stock, description, id]
  )
}

async function findNameById(id) {
  const result = await db.query('SELECT name FROM products WHERE id = $1', [id])
  return result.rows[0]?.name
}

module.exports = {
  findAll,
  findNameById,
  updateById
}
