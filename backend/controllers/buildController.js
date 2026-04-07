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
    const { socket, ram_type, sort, brand, wattage, cooler_type, ssd_tb, monitor_size } = req.query
    const allowed = ["CPU", "MOTHERBOARD", "RAM", "SSD", "HDD", "PSU", "CASE", "GPU", "COOLER", "MONITOR", "KEYBOARD", "MOUSE"]
    const typeValue = String(type || "").trim().toUpperCase()

    if (!allowed.includes(typeValue)) {
      return res.status(400).json({ error: "Type de composant non supporté" })
    }

    let query = "SELECT * FROM products WHERE TRIM(UPPER(type)) = ?"
    const params = [typeValue]

    if ((typeValue === "MOTHERBOARD" || typeValue === "CPU") && socket) {
      query += " AND socket = ?"
      params.push(socket)
    }

    if (typeValue === "RAM" && ram_type) {
      query += " AND ram_type = ?"
      params.push(ram_type)
    }

    if (typeValue === "GPU" && brand) {
      const cleaned = String(brand).toUpperCase()
      if (cleaned === 'AMD') {
        query += " AND UPPER(name) LIKE '%AMD%'"
      } else if (cleaned === 'NVIDIA' || cleaned === 'NVIDIA RTX' || cleaned === 'NVIDIA GEFORCE') {
        query += " AND UPPER(name) LIKE '%NVIDIA%'"
      }
    }

    if (typeValue === "PSU" && wattage) {
      const w = Number(wattage)
      if (!Number.isNaN(w)) {
        query += " AND power >= ?"
        params.push(w)
      }
    }

    if (typeValue === "COOLER" && cooler_type) {
      const t = String(cooler_type).toLowerCase()
      if (t === 'water' || t === 'watercooling') {
        query += " AND (UPPER(description) LIKE '%WATER%' OR UPPER(name) LIKE '%WATER%' OR UPPER(description) LIKE '%LIQUID%' OR UPPER(name) LIKE '%LIQUID%')"
      } else if (t === 'air' || t === 'ventirad') {
        query += " AND (UPPER(description) LIKE '%AIR%' OR UPPER(name) LIKE '%AIR%' OR UPPER(description) LIKE '%VENTI%' OR UPPER(name) LIKE '%VENTI%')"
      }
    }

    if (typeValue === "SSD" && ssd_tb) {
      const tb = String(ssd_tb)
      query += " AND (UPPER(name) LIKE ? OR UPPER(description) LIKE ? )"
      params.push('%' + tb.toUpperCase() + 'TB%')
      params.push('%' + tb.toUpperCase() + 'TB%')
    }

    if (typeValue === "MONITOR" && monitor_size) {
      const size = String(monitor_size)
      query += " AND (UPPER(name) LIKE ? OR UPPER(description) LIKE ? )"
      params.push('%' + size + '"%')
      params.push('%' + size + '"%')
    }

    if (sort === 'price_asc') query += ' ORDER BY price ASC'
    else if (sort === 'price_desc') query += ' ORDER BY price DESC'
    else query += ' ORDER BY id DESC'

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