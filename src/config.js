const { config } = require('dotenv')
config()

const PORT = process.env.PORT || 5000

const db = {
  server: process.env.DB_SERVER,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
}

module.exports = { db, PORT }