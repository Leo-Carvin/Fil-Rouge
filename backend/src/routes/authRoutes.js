const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const { verifyToken } = require('../middleware/auth')  // ← corrigé

router.post('/register', authController.register)
router.post('/login', authController.login)
router.delete('/delete-account', verifyToken, authController.deleteAccount)  // ← verifyToken

module.exports = router