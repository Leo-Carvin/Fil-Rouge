const db = require('../config/db')

exports.getCPUs = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products WHERE type='CPU'")
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.getMotherboards = async (req, res) => {
  try {
    const { socket } = req.params

    const [rows] = await db.query(
      "SELECT * FROM products WHERE type='Motherboard' AND socket=?",
      [socket]
    )

    res.json(rows)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.getRAM = async (req, res) => {
  try {
    const { ram_type } = req.params

    const [rows] = await db.query(
      "SELECT * FROM products WHERE type='RAM' AND ram_type=?",
      [ram_type]
    )

    res.json(rows)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.saveBuild = async (req, res) => {
  try {

    const { user_id, components } = req.body

    const [result] = await db.query(
      "INSERT INTO pc_builds (user_id, total_price) VALUES (?,0)",
      [user_id]
    )

    const buildId = result.insertId

    for (const component of components) {
      await db.query(
        "INSERT INTO pc_build_components (pc_build_id, product_id, quantity) VALUES (?,?,1)",
        [buildId, component]
      )
    }

    res.json({ message: "PC configuré sauvegardé", buildId })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}