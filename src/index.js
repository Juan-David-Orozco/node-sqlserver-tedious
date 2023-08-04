const app = require('./app')
const { PORT } = require('./config')
const { connectDB } = require('./db')

connectDB()

app.listen(PORT)
console.log('Server run on port', PORT)