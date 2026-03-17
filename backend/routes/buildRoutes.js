const express = require('express')
const router = express.Router()

const buildController = require('../controllers/buildController')

router.get('/cpus', buildController.getCPUs)
router.get('/motherboards/:socket', buildController.getMotherboards)
router.get('/ram/:ram_type', buildController.getRAM)
router.get('/components/:type', buildController.getComponentsByType)
router.post('/save', buildController.saveBuild)

module.exports = router