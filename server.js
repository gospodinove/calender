const express = require('express')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient
const bcrypt = require('bcrypt')
const session = require('express-session')
const dotenv = require('dotenv')
const MongoStore = require('connect-mongo')
const { validate } = require('indicative/validator')
const { getValue, skippable } = require('indicative-utils')
const { extend } = require('indicative/validator')

dotenv.config()

const app = express()

const messages = {
  required: 'This field is required',
  email: 'Enter valid email address',
  password: 'Min 8 characters (capital & lowercase letter, special character)'
}

extend('password', {
  async: true,

  compile(args) {
    return args
  },

  async validate(data, field, args, config) {
    const fieldValue = getValue(data, field)

    if (skippable(fieldValue, field, config)) {
      return true
    }

    return (
      /[A-Z]/.test(fieldValue) &&
      /[a-z]/.test(fieldValue) &&
      /[0-9]/.test(fieldValue) &&
      /[^A-Za-z0-9]/.test(fieldValue) &&
      fieldValue.length >= 8
    )
  }
})

MongoClient.connect(
  `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@realmcluster.hhded.mongodb.net/?retryWrites=true&w=majority`
)
  .then(client => {
    const db = client.db('calender')

    const users = db.collection('users')

    app.use(
      cors({
        origin: 'http://localhost:3000',
        credentials: true
      })
    )

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

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

    app.post('/login', async (req, res) => {
      try {
        const schema = {
          email: 'required|email',
          password: 'required'
        }

        await validate(req.body, schema, messages)

        const user = await users.findOne({ email: req.body.email })

        if (!user) {
          res.json({
            success: false,
            errors: [{ message: 'Email is not registered', field: 'email' }]
          })
          return
        }

        const validPassword = await bcrypt.compare(
          req.body.password,
          user.password
        )

        if (validPassword) {
          req.session.user = user

          res.json({ success: true, user })
        } else {
          res.json({
            success: false,
            errors: [{ message: 'Wrong password', field: 'password' }]
          })
        }
      } catch (errors) {
        res.json({ success: false, errors })
      }
    })

    app.post('/register', async (req, res) => {
      try {
        const schema = {
          firstName: 'required|string',
          lastName: 'required|string',
          email: 'required|email',
          password: 'required|password'
        }

        await validate(req.body, schema, messages)

        const user = await users.findOne({ email: req.body.email })

        if (user) {
          res.json({
            success: false,
            errors: [{ field: 'email', message: 'Email is taken' }]
          })
          return
        }

        const salt = await bcrypt.genSalt(10)
        const password = await bcrypt.hash(req.body.password, salt)

        const newUser = await users.insertOne({ ...req.body, password })

        req.session.user = newUser

        res.json({
          success: true,
          user: newUser
        })
      } catch (errors) {
        res.json({ success: false, errors })
      }
    })

    app.get('/session-user', (req, res) => {
      res.json({ user: req.session.user })
    })

    app.get('/logout', (req, res) => {
      try {
        const user = req.session.user

        if (user) {
          req.session.destroy(err => {
            if (err) {
              throw err
            }

            res.clearCookie(process.env.SESSION_NAME)
            res.json({ success: true })
          })
        } else {
          throw new Error('Something went wrong')
        }
      } catch (err) {
        res.json({ success: false, error: 'Something went wrong' })
      }
    })

    app.listen(8080, () =>
      console.log('API is running on http://localhost:8080')
    )
  })
  .catch(console.error)
