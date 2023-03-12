const { config } = require('dotenv')
config()

const db = {
  server: process.env.DB_SERVER,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
}

module.exports = { db }