const express = require('express')
const router = express.Router()
const buildController = require('../controllers/buildController')

router.get('/components/:type', buildController.getComponentsByType)
router.post('/save', buildController.saveBuild)

module.exports = router
