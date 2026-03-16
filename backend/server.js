require('dotenv').config()

const express = require('express')
const cors = require('cors')

const productRoutes = require('./routes/productRoutes')
const buildRoutes = require('./routes/buildRoutes')
const authRoutes = require('./routes/authRoutes')


const app = express()

app.use(cors())
app.use(express.json())
app.use('/build', buildRoutes)
app.use('/auth', authRoutes)

app.use('/products', productRoutes)

app.get("/", (req,res)=>{
  res.send("API PCSTORE fonctionne")
})

app.listen(process.env.PORT, ()=>{
  console.log("🚀 serveur lancé sur port " + process.env.PORT)
})