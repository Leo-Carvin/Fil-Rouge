require('dotenv').config()
const jwt = require('jsonwebtoken')
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzc2MDcwNzM4LCJleHAiOjE3NzYxNTcxMzh9.bJ1Bof2DdFh4S1CZBn-r9R5REfy5LYXGTq_omTRlh2Y'
const secrets = ['un_secret_tres_long_et_aleatoire_ici_2024!', 'secretkey', 'fallback_secret']
secrets.forEach(s => {
  try { jwt.verify(token, s); console.log('OK avec:', s) }
  catch(e) { console.log('FAIL avec:', s) }
})
