const db = require('../config/db')

exports.getProducts = async (req, res) => {
  try {
    const { type, search, sort } = req.query
    let query = "SELECT * FROM products WHERE 1=1"
    const params = []
    let i = 1

    if (type && type !== "All") {
      query += ` AND UPPER(type) = $${i++}`
      params.push(type.toUpperCase())
    }
    if (search) {
      query += ` AND (UPPER(name) LIKE $${i++} OR UPPER(description) LIKE $${i++})`
      params.push(`%${search.toUpperCase()}%`)
      params.push(`%${search.toUpperCase()}%`)
    }
    if (sort === "price_asc") query += " ORDER BY price ASC"
    else if (sort === "price_desc") query += " ORDER BY price DESC"
    else query += " ORDER BY id DESC"

    const result = await db.query(query, params)
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.updateProduct = async (req, res) => {
  try {
    const { name, price, stock, description } = req.body
    await db.query(
      "UPDATE products SET name=$1, price=$2, stock=$3, description=$4 WHERE id=$5",
      [name, price, stock, description, req.params.id]
    )
    res.json({ message: 'Produit mis à jour' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}