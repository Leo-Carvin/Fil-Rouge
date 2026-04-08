const db = require('../config/db')

exports.getProducts = async (req, res) => {
  try {
    const { type, search, sort } = req.query
    let query = "SELECT * FROM products WHERE 1=1"
    const params = []

    if (type && type !== "All") {
      query += " AND UPPER(type) = ?"
      params.push(type.toUpperCase())
    }

    if (search) {
      query += " AND (UPPER(name) LIKE ? OR UPPER(description) LIKE ?)"
      params.push(`%${search.toUpperCase()}%`)
      params.push(`%${search.toUpperCase()}%`)
    }

    if (sort === "price_asc") query += " ORDER BY price ASC"
    else if (sort === "price_desc") query += " ORDER BY price DESC"
    else query += " ORDER BY id DESC"

    const [rows] = await db.query(query, params)
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.updateProduct = async (req, res) => {
  try {
    const { name, price, stock, description } = req.body
    await db.query(
      "UPDATE products SET name=?, price=?, stock=?, description=? WHERE id=?",
      [name, price, stock, description, req.params.id]
    )
    res.json({ message: 'Produit mis à jour' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}