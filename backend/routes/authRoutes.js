const express = require('express')
const bcrypt = require('bcrypt')
const { validate } = require('indicative/validator')
const { extend } = require('indicative/validator')
const { replace_id } = require('../utils')
const {
  passwordValidator,
  validationMessages: messages
} = require('../validation')

const router = express.Router()

extend('password', passwordValidator)

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

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    )

    if (!isPasswordValid) {
      res.json({
        success: false,
        errors: [{ message: 'Wrong password', field: 'password' }]
      })
      return
    }

    replace_id(user)

    delete user.password

    req.session.user = user
    res.json({ success: true, user })
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

    const registeredUser = await db
      .collection('users')
      .findOne({ email: req.body.email })

    if (registeredUser) {
      res.json({
        success: false,
        errors: [{ field: 'email', message: 'Email is taken' }]
      })
      return
    }

    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(req.body.password, salt)

    const user = { ...req.body, password }

    await db.collection('users').insertOne(user)

    replace_id(user)

    delete user.password

    req.session.user = user

    res.json({ success: true, user })
  } catch (errors) {
    res.json({ success: false, errors })
  }
})

router.get('/session-user', (req, res) => {
  res.json(req.session.user)
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
