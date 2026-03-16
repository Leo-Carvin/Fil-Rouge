require('dotenv').config()

const express = require('express')
const mysql = require('mysql2/promise')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

let db

async function connectDB() {
  db = await mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  })

  console.log("✅ Connecté à MySQL")
}

connectDB()

app.get("/", (req,res)=>{
  res.send("API PCSTORE fonctionne")
})

app.get("/products", async (req,res)=>{
  const [rows] = await db.query("SELECT * FROM products")
  res.json(rows)
})

const PORT = process.env.PORT

app.listen(PORT, ()=>{
  console.log("🚀 serveur lancé sur port " + PORT)
})