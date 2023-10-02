require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const crypto = require('crypto')
const MongoStore = require('connect-mongo')

const BoatRoutes = require('./routes/boat')
const AuthRoutes = require('./routes/auth')
const ReservationRoutes = require('./routes/reservation')
const { sessionChecker } = require('./controllers/AuthController')
const dbUrl = process.env.DB_URL
const secretKey = crypto.randomBytes(32).toString('hex')
// console.log(secretKey, 'secret')

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', (err) => {
  console.log(err)
})

db.once('open', () => {
  console.log('DB Connection Established!')
})

const app = express()
const allowedOrigins = ['http://localhost:3001', 'http://localhost:3002']

app.use(
  cors({
    origin: function (origin, callback) {
      // Check if the origin starts with http://localhost
      if (
        !origin ||
        allowedOrigins.some((allowed) => origin.startsWith(allowed))
      ) {
        callback(null, true) // Allow the request
      } else {
        callback(new Error('Not allowed by CORS')) // Deny the request
      }
    },
    credentials: true,
    methods: ['GET', 'POST'],
  })
)

app.use(cookieParser())
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/uploads', express.static('uploads'))
app.use(
  session({
    key: 'sessionId',
    secret: process.env.JWT_SECRET, // Replace with a strong secret key
    resave: false,
    store: MongoStore.create({
      mongoUrl: dbUrl,
      collectionName: 'sessions',
      ttl: 60 * 60 * 24, // 1 day
    }),
    saveUninitialized: true,
  })
)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`)
})

app.use('/api/boat', BoatRoutes)
app.use('/api', AuthRoutes)
app.get('/login', sessionChecker)
app.use('/api', ReservationRoutes)
