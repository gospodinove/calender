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

router.post('', async (req, res) => {
  const db = req.app.locals.db

  const event = {
    title: req.body.title,
    description: req.body.description,
    start: new Date(req.body.start),
    end: new Date(req.body.end)
  }

  try {
    const schema = {
      title: 'required|string',
      description: 'string',
      // TODO: before/after validation
      start: `required|date`,
      end: `required|date`
    }

    if (req.body.isShared) {
      schema.name = 'required|string'
      schema.email = 'required|email'
    }

    await validate(req.body, schema, validationMessages)

    try {
      if (isMultidayEvent(event)) {
        const eventSplits = splitMultidayEvent(event).map(e => ({
          ...e,
          ownerId: req.body.isShared
            ? req.body.scheduleOwnerId
            : req.session.user.id,
          creatorId: req.session.user?.id,
          sharedData: req.body.isShared
            ? {
                name: req.body.name,
                email: req.body.email
              }
            : undefined
        }))

        await db.collection('events').insertMany(eventSplits)

        res.json({
          success: true,
          events: eventSplits.map(e => replaceId(e))
        })
      } else {
        const newEvent = {
          ...event,
          ownerId: req.body.isShared
            ? req.body.scheduleOwnerId
            : req.session.user.id,
          creatorId: req.session.user?.id,
          sharedData: req.body.isShared
            ? {
                name: req.body.name,
                email: req.body.email
              }
            : undefined
        }

        await db.collection('events').insertOne(newEvent)

        res.json({
          success: true,
          event: replaceId(newEvent)
        })
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
      .find({
        $or: [
          { ownerId: req.session.user.id },
          { creatorId: req.session.user.id }
        ],
        start: { $gte: start, $lte: end }
      })
      .toArray()

    res.json({
      success: true,
      events: events
        .map(e => replaceId(e))
        .map(e => ({
          ...e,
          color: e.creatorId !== e.ownerId ? 'purple' : undefined
        }))
    })
  } catch (errors) {
    sendErrorResponse(res, 500, 'general', 'Something went wrong')
  }
})

module.exports = router
