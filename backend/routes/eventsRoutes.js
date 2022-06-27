const express = require('express')
const { validate } = require('indicative/validator')
const isAuthenticated = require('../middleware/isAuthenticated')
const { replaceId, sendErrorResponse } = require('../utils')
const { validationMessages } = require('../validation')

const router = express.Router()

router.post('', isAuthenticated, async (req, res) => {
  const db = req.app.locals.db

  const event = req.body

  try {
    const schema = {
      title: 'required|string',
      description: 'string|max:250',
      start: `required|date|before:${new Date(event.end)}`,
      end: `required|date|after:${new Date(event.start)}`
    }

    await validate(event, schema, validationMessages)

    try {
      await db.collection('events').insertOne(event)

      res.json({ success: true, event: replaceId(event) })
    } catch (err) {
      sendErrorResponse(res, 500, 'general', 'Could not create event')
    }
  } catch (errors) {
    sendErrorResponse(res, 500, 'validation-error', errors)
  }
})

router.get('', isAuthenticated, async (req, res) => {
  const db = req.app.locals.db

  const startDate = req.query.startDate
  const endDate = req.query.endDate

  const start = new Date(startDate)
  start.setHours(0, 0, 0, 0)

  const end = new Date(endDate)
  end.setHours(23, 59, 59, 999)

  try {
    const events = await db
      .collection('events')
      .find({ start: { $gte: start, $lte: end } })
      .toArray()

    res.json({ success: true, events: events.map(e => replaceId(e)) })
  } catch (errors) {
    sendErrorResponse(res, 500, { main: 'Something went wrong' }, errors)
  }
})

module.exports = router
