const db = require('../config/db')
const { sendOrderConfirmation } = require('../services/mailer')

exports.createOrder = async (req, res) => {
  try {
    const { user_id, items } = req.body
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

    const [result] = await db.query(
      "INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, 'pending')",
      [user_id, total]
    )
    const orderId = result.insertId

    for (const item of items) {
      await db.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?,?,?,?)",
        [orderId, item.product_id, item.quantity, item.price]
      )
    }

    // Récupérer l'email de l'utilisateur
    const [users] = await db.query("SELECT email FROM users WHERE id = ?", [user_id])
    const userEmail = users[0]?.email

    // Récupérer les noms des produits pour l'email
    const itemsWithNames = await Promise.all(items.map(async (item) => {
      const [products] = await db.query("SELECT name FROM products WHERE id = ?", [item.product_id])
      return { ...item, name: products[0]?.name || "Produit" }
    }))

    // Envoyer l'email de confirmation
    if (userEmail) {
      await sendOrderConfirmation(userEmail, orderId, itemsWithNames, total)
    }

    res.json({ message: "Commande créée", orderId })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.getUserOrders = async (req, res) => {
  try {
    const { user_id } = req.params
    const [orders] = await db.query(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
      [user_id]
    )
    for (const order of orders) {
      const [items] = await db.query(
        `SELECT oi.*, p.name, p.image FROM order_items oi 
         JOIN products p ON oi.product_id = p.id 
         WHERE oi.order_id = ?`,
        [order.id]
      )
      order.items = items
    }
    res.json(orders)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}