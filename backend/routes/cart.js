const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { verifyToken } = require("../middleware/auth");

// GET /cart — récupérer le panier de l'utilisateur
router.get("/", verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT ci.id, ci.quantity, p.id as product_id, p.name, p.price, p.type, p.image, p.socket, p.ram_type
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = ?`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /cart — ajouter ou mettre à jour un item
router.post("/", verifyToken, async (req, res) => {
  const { product_id, quantity } = req.body;
  try {
    const [existing] = await db.query(
      "SELECT id FROM cart_items WHERE user_id = ? AND product_id = ?",
      [req.user.id, product_id]
    );
    if (existing.length > 0) {
      await db.query(
        "UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?",
        [quantity, req.user.id, product_id]
      );
    } else {
      await db.query(
        "INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)",
        [req.user.id, product_id, quantity]
      );
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /cart/:product_id — supprimer un item
router.delete("/:product_id", verifyToken, async (req, res) => {
  try {
    await db.query(
      "DELETE FROM cart_items WHERE user_id = ? AND product_id = ?",
      [req.user.id, req.params.product_id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /cart — vider le panier (après commande)
router.delete("/", verifyToken, async (req, res) => {
  try {
    await db.query("DELETE FROM cart_items WHERE user_id = ?", [req.user.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;