const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret'

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token)
    return res.status(401).json({ message: 'Token manquant' })

  // Essaie les deux secrets pour la transition
  const secrets = [JWT_SECRET, 'secretkey']
  let decoded = null

  for (const secret of secrets) {
    try {
      decoded = jwt.verify(token, secret)
      break
    } catch (e) {}
  }

  if (!decoded)
    return res.status(403).json({ message: 'Token invalide ou expiré' })

  req.user = decoded
  next()
}

exports.verifyAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin')
    return res.status(403).json({ message: 'Accès réservé aux admins' })
  next()
}