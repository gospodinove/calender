const express = require('express')
const bcrypt = require('bcrypt')
const { validate } = require('indicative/validator')
const { getValue, skippable } = require('indicative-utils')
const { extend } = require('indicative/validator')

const router = express.Router()

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

router.post('/login', async (req, res) => {
  const db = req.app.locals.db

  try {
    const schema = {
      email: 'required|email',
      password: 'required'
    }

    await validate(req.body, schema, messages)

    const user = await db.collection('users').findOne({ email: req.body.email })

    if (!user) {
      res.json({
        success: false,
        errors: [{ message: 'Email is not registered', field: 'email' }]
      })
      return
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password)

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

router.post('/register', async (req, res) => {
  const db = req.app.locals.db

  try {
    const schema = {
      firstName: 'required|string',
      lastName: 'required|string',
      email: 'required|email',
      password: 'required|password'
    }

    await validate(req.body, schema, messages)

    const user = await db.collection('users').findOne({ email: req.body.email })

    if (user) {
      res.json({
        success: false,
        errors: [{ field: 'email', message: 'Email is taken' }]
      })
      return
    }

    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(req.body.password, salt)

    const newUser = await db
      .collection('users')
      .insertOne({ ...req.body, password })

    req.session.user = newUser

    res.json({
      success: true,
      user: newUser
    })
  } catch (errors) {
    res.json({ success: false, errors })
  }
})

router.get('/session-user', (req, res) => {
  res.json({ user: req.session.user })
})

router.get('/logout', (req, res) => {
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

module.exports = router
