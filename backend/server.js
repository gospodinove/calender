const express = require('express')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient
const session = require('express-session')
const dotenv = require('dotenv')
const MongoStore = require('connect-mongo')
const authRoutes = require('./routes/authRoutes')
const eventsRoutes = require('./routes/eventsRoutes')
const sharedConfigRoutes = require('./routes/sharedConfigRoutes')
const usersRoutes = require('./routes/usersRoutes')
const logger = require('morgan')

dotenv.config()

const app = express()
const apiRouter = express.Router()

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(logger('dev'))

MongoClient.connect(
  `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@realmcluster.hhded.mongodb.net/?retryWrites=true&w=majority`
)
  .then(client => {
    app.locals.db = client.db('calender')

    app.use(
      session({
        name: process.env.SESSION_NAME,
        secret: process.env.SESSION_SECRET_KEY,
        saveUninitialized: true,
        resave: false,
        store: MongoStore.create({ client, dbName: 'calender' }),
        cookie: {
          sameSite: 'lax',
          secure: false,
          maxAge: 1000 * 60 * 60 * 24 * 30 // 30 days
        }
      })
    )

    app.use('/api', apiRouter)
    apiRouter.use('/', authRoutes)
    apiRouter.use('/events', eventsRoutes)
    apiRouter.use('/shared', sharedConfigRoutes)
    apiRouter.use('/users', usersRoutes)

    app.listen(8080, () =>
      console.log('API is running on http://localhost:8080')
    )
  })
  .catch(console.error)
