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

exports.getComponentsByType = async (req, res) => {
  try {
    const { type } = req.params
    const { socket, ram_type } = req.query
    const allowed = ["CPU", "MOTHERBOARD", "RAM", "SSD", "HDD", "PSU", "CASE", "GPU", "COOLER", "MONITOR", "KEYBOARD", "MOUSE"]
    const typeValue = String(type || "").trim().toUpperCase()

    if (!allowed.includes(typeValue)) {
      return res.status(400).json({ error: "Type de composant non supporté" })
    }

    let query = "SELECT * FROM products WHERE TRIM(UPPER(type)) = ?"
    const params = [typeValue]

    if (typeValue === "MOTHERBOARD" && socket) {
      query += " AND socket = ?"
      params.push(socket)
    }

    if (typeValue === "RAM" && ram_type) {
      query += " AND ram_type = ?"
      params.push(ram_type)
    }

    const [rows] = await db.query(query, params)
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