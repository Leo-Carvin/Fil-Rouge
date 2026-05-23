const db = require('../config/db')

exports.getCPUs = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM products WHERE type='CPU'")
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.getMotherboards = async (req, res) => {
  try {
    const { socket } = req.params
    const result = await db.query(
      "SELECT * FROM products WHERE type='Motherboard' AND socket=$1",
      [socket]
    )
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.getRAM = async (req, res) => {
  try {
    const { ram_type } = req.params
    const result = await db.query(
      "SELECT * FROM products WHERE type='RAM' AND ram_type=$1",
      [ram_type]
    )
    res.json(result.rows)
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

    let query = "SELECT * FROM products WHERE TRIM(UPPER(type)) = $1"
    const params = [typeValue]
    let i = 2

    if ((typeValue === "MOTHERBOARD" || typeValue === "CPU") && socket) {
      query += ` AND socket = $${i++}`
      params.push(socket)
    }

    if (typeValue === "RAM" && ram_type) {
      query += ` AND ram_type = $${i++}`
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
        query += ` AND power >= $${i++}`
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
      query += ` AND (UPPER(name) LIKE $${i++} OR UPPER(description) LIKE $${i++})`
      params.push('%' + tb.toUpperCase() + 'TB%')
      params.push('%' + tb.toUpperCase() + 'TB%')
    }

    if (typeValue === "MONITOR" && monitor_size) {
      const size = String(monitor_size)
      query += ` AND (UPPER(name) LIKE $${i++} OR UPPER(description) LIKE $${i++})`
      params.push('%' + size + '"%')
      params.push('%' + size + '"%')
    }

    if (sort === 'price_asc') query += ' ORDER BY price ASC'
    else if (sort === 'price_desc') query += ' ORDER BY price DESC'
    else query += ' ORDER BY id DESC'

    const result = await db.query(query, params)
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.saveBuild = async (req, res) => {
  try {
    const { user_id, components } = req.body
    const result = await db.query(
      "INSERT INTO pc_builds (user_id, total_price) VALUES ($1, 0) RETURNING id",
      [user_id]
    )
    const buildId = result.rows[0].id

    for (const component of components) {
      await db.query(
        "INSERT INTO pc_build_components (pc_build_id, product_id, quantity) VALUES ($1, $2, 1)",
        [buildId, component]
      )
    }

    res.json({ message: "PC configuré sauvegardé", buildId })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}