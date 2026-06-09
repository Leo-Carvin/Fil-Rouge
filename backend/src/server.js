const dns = require('dns')
require('./config/env')

const app = require('./app')

dns.setDefaultResultOrder('ipv4first')

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log('Serveur lance sur port ' + PORT)
})
