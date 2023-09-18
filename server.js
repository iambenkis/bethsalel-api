require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const BoatRoutes = require('./routes/boat')
const AuthRoutes = require('./routes/auth')
const ReservationRoutes = require('./routes/reservation')
const dbUrl = process.env.DB_URL

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', (err) => {
  console.log(err)
})

db.once('open', () => {
  console.log('DB Connection Established!')
})

const app = express()

app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/uploads', express.static('uploads'))

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`)
})

app.use('/api/boat', BoatRoutes)
app.use('/api', AuthRoutes)
app.use('/api', ReservationRoutes)
