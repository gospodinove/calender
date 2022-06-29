const express = require('express')
const { validate } = require('indicative/validator')
const isAuthenticated = require('../middleware/isAuthenticated')
const {
  replaceId,
  sendErrorResponse,
  isMultidayEvent,
  splitMultidayEvent
} = require('../utils')
const { validationMessages } = require('../validation')

const router = express.Router()

router.post('', isAuthenticated, async (req, res) => {
  const db = req.app.locals.db

  const event = req.body

  try {
    const schema = {
      title: 'required|string',
      description: 'string|max:250',
      // TODO: before/after validation
      start: `required|date`,
      end: `required|date`
    }

    await validate(event, schema, validationMessages)

    try {
      if (isMultidayEvent(event)) {
        const eventSplits = splitMultidayEvent(event).map(e => ({
          ...e,
          userId: req.session.user.id
        }))

        await db.collection('events').insertMany(eventSplits)

        res.json({ success: true, events: eventSplits.map(e => replaceId(e)) })
      } else {
        await db
          .collection('events')
          .insertOne({ ...event, userId: req.session.user.id })

        res.json({ success: true, event: replaceId(event) })
      }
    } catch (err) {
      sendErrorResponse(res, 500, 'general', 'Could not create event')
    }
  } catch (errors) {
    sendErrorResponse(res, 500, 'field-error', errors)
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
      .find({ userId: req.session.user.id, start: { $gte: start, $lte: end } })
      .toArray()

    res.json({ success: true, events: events.map(e => replaceId(e)) })
  } catch (errors) {
    sendErrorResponse(res, 500, 'general', 'Something went wrong')
  }
})

module.exports = router
