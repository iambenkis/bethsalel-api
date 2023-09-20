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

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', (err) => {
  console.log(err)
})

db.once('open', () => {
  console.log('DB Connection Established!')
})

const app = express()

app.use(
  cors({
    origin: 'http://localhost:3001',
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
    key: 'userId',
    secret: secretKey, // Replace with a strong secret key
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: dbUrl,
    }),
    cookie: {
      expires: 60 * 60 * 24,
    },
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
