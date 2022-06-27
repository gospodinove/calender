const express = require('express')
const bcrypt = require('bcrypt')
const { validate } = require('indicative/validator')
const { extend } = require('indicative/validator')
const { replaceId, sendErrorResponse } = require('../utils')
const { passwordValidator, validationMessages } = require('../validation')

const router = express.Router()

extend('password', passwordValidator)

router.post('/login', async (req, res) => {
  const db = req.app.locals.db

  try {
    const schema = {
      email: 'required|email',
      password: 'required'
    }

    await validate(req.body, schema, validationMessages)

    try {
      const user = await db
        .collection('users')
        .findOne({ email: req.body.email })

      if (!user) {
        sendErrorResponse(res, 500, 'field-error', [
          { message: 'Email is not registered', field: 'email' }
        ])
        return
      }

      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        user.password
      )

      if (!isPasswordValid) {
        sendErrorResponse(res, 500, 'field-error', [
          { field: 'password', message: 'Wrong password' }
        ])
        return
      }

      replaceId(user)

      delete user.password

      req.session.user = user
      res.json({ success: true, user })
    } catch (err) {
      sendErrorResponse(res, 500, 'general', 'Could not login')
    }
  } catch (errors) {
    sendErrorResponse(res, 500, 'field-error', errors)
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

    await validate(req.body, schema, validationMessages)

    try {
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

      replaceId(user)

      delete user.password

      req.session.user = user

      res.json({ success: true, user })
    } catch {
      sendErrorResponse(res, 500, 'general', 'Could not register user')
    }
  } catch (errors) {
    sendErrorResponse(res, 500, 'field-error', errors)
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
      sendErrorResponse(res, 500, 'general', 'Could not logout')
    }
  } catch {
    sendErrorResponse(res, 500, 'general', 'Could not logout')
  }
})

module.exports = router
