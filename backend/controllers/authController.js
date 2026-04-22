const db = require('../config/db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret'

// Validation mot de passe fort
function validatePassword(password) {
  const errors = []
  if (password.length < 8) errors.push("Au moins 8 caractères")
  if (!/[A-Z]/.test(password)) errors.push("Au moins une majuscule")
  if (!/[0-9]/.test(password)) errors.push("Au moins un chiffre")
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) errors.push("Au moins un caractère spécial")
  return errors
}

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password)
      return res.status(400).json({ message: "Email et mot de passe requis" })

    // Validation mot de passe fort
    const passwordErrors = validatePassword(password)
    if (passwordErrors.length > 0)
      return res.status(400).json({ message: "Mot de passe trop faible", errors: passwordErrors })

    // Vérif email déjà utilisé
    const [existing] = await db.query("SELECT id FROM users WHERE email=?", [email])
    if (existing.length > 0)
      return res.status(409).json({ message: "Cet email est déjà utilisé" })

    const hashedPassword = await bcrypt.hash(password, 12)

    await db.query(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hashedPassword]
    )

    res.status(201).json({ message: "Compte créé avec succès" })
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password)
      return res.status(400).json({ message: "Email et mot de passe requis" })

    const [rows] = await db.query("SELECT * FROM users WHERE email=?", [email])

    // Message générique pour ne pas révéler si l'email existe (RGPD)
    if (rows.length === 0)
      return res.status(401).json({ message: "Identifiants incorrects" })

    const user = rows[0]
    const valid = await bcrypt.compare(password, user.password)

    if (!valid)
      return res.status(401).json({ message: "Identifiants incorrects" })
    console.log('JWT_SECRET au moment du login:', JWT_SECRET)
    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    )

    res.json({ token, user: { id: user.id, email: user.email, role: user.role } })
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message })
  }
}

exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id
    console.log('Suppression compte userId:', userId)

    await db.query("DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE user_id=?)", [userId])
    await db.query("DELETE FROM orders WHERE user_id=?", [userId])
    await db.query("DELETE FROM pc_build_components WHERE pc_build_id IN (SELECT id FROM pc_builds WHERE user_id=?)", [userId])    
    await db.query("DELETE FROM pc_builds WHERE user_id=?", [userId])
    await db.query("DELETE FROM users WHERE id=?", [userId])

    res.json({ message: "Compte supprimé définitivement" })
  } catch (err) {
    console.log('ERREUR deleteAccount code:', err.code)
    console.log('ERREUR deleteAccount sql:', err.sqlMessage)
    res.status(500).json({ message: "Erreur serveur", error: err.message })
  }
}