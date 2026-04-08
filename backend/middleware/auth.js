const jwt = require('jsonwebtoken')

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token)
    return res.status(401).json({ message: 'Token manquant' })

  try {
    const decoded = jwt.verify(token, 'secretkey')
    req.user = decoded
    next()
  } catch (err) {
    return res.status(403).json({ message: 'Token invalide ou expiré' })
  }
}

exports.verifyAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin')
    return res.status(403).json({ message: 'Accès réservé aux admins' })
  next()
}