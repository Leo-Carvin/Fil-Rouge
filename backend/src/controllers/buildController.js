const buildModel = require('../models/buildModel')

exports.getCPUs = async (req, res) => {
  try {
    const cpus = await buildModel.findCPUs()
    res.json(cpus)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.getMotherboards = async (req, res) => {
  try {
    const motherboards = await buildModel.findMotherboardsBySocket(req.params.socket)
    res.json(motherboards)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.getRAM = async (req, res) => {
  try {
    const ram = await buildModel.findRAMByType(req.params.ram_type)
    res.json(ram)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.getComponentsByType = async (req, res) => {
  try {
    const components = await buildModel.findComponentsByType(req.params.type, req.query)
    res.json(components)
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message })
  }
}

exports.saveBuild = async (req, res) => {
  try {
    const buildId = await buildModel.save({
      userId: req.body.user_id,
      components: req.body.components
    })
    res.json({ message: 'PC configure sauvegarde', buildId })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
