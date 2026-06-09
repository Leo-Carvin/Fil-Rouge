const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret'

function validatePassword(password) {
  const errors = []
  if (password.length < 8) errors.push('Au moins 8 caracteres')
  if (!/[A-Z]/.test(password)) errors.push('Au moins une majuscule')
  if (!/[0-9]/.test(password)) errors.push('Au moins un chiffre')
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) errors.push('Au moins un caractere special')
  return errors
}

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' })
    }

    const passwordErrors = validatePassword(password)
    if (passwordErrors.length > 0) {
      return res.status(400).json({ message: 'Mot de passe trop faible', errors: passwordErrors })
    }

    const existing = await userModel.existsByEmail(email)
    if (existing) {
      return res.status(409).json({ message: 'Cet email est deja utilise' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    await userModel.create({ email, password: hashedPassword })
    res.status(201).json({ message: 'Compte cree avec succes' })
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' })
    }

    const user = await userModel.findByEmail(email)
    if (!user) {
      return res.status(401).json({ message: 'Identifiants incorrects' })
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return res.status(401).json({ message: 'Identifiants incorrects' })
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.json({ token, user: { id: user.id, email: user.email, role: user.role } })
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}

exports.deleteAccount = async (req, res) => {
  try {
    await userModel.deleteAccount(req.user.id)
    res.json({ message: 'Compte supprime definitivement' })
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message })
  }
}
