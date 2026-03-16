const db = require('../config/db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {

  const { email, password } = req.body

  const hashedPassword = await bcrypt.hash(password, 10)

  await db.query(
    "INSERT INTO users (email,password) VALUES (?,?)",
    [email, hashedPassword]
  )

  res.json({ message: "Utilisateur créé" })
}

exports.login = async (req, res) => {
  const { email, password } = req.body

  const [rows] = await db.query(
    "SELECT * FROM users WHERE email=?",
    [email]
  )

  if (rows.length === 0)
    return res.status(401).json({ message: "Utilisateur introuvable" })

  const user = rows[0]

  const valid = await bcrypt.compare(password, user.password)

  if (!valid)
    return res.status(401).json({ message: "Mot de passe incorrect" })

  const token = jwt.sign(
    { id: user.id, role: user.role },
    "secretkey",
    { expiresIn: "24h" }
  )

  res.json({ token })
}