require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const session = require('express-session')

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
app.use(
  session({
    secret: 'your_secret_key', // Replace with a strong secret key
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in a production environment if using HTTPS
      maxAge: 3600000, // Session timeout in milliseconds (e.g., 1 hour)
    },
  })
)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`)
})

app.use('/api/boat', BoatRoutes)
app.use('/api', AuthRoutes)
app.use('/api', ReservationRoutes)
