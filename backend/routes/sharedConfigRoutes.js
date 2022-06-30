const express = require('express')
const { ObjectId } = require('mongodb')
const isAuthenticated = require('../middleware/isAuthenticated')
const {
  sendErrorResponse,
  replaceId,
  getFreeSlotsInRange
} = require('../utils')

const router = express.Router()

router.post('', isAuthenticated, async (req, res) => {
  const db = req.app.locals.db
  const id =
    req.session.user.id +
    (req.body.type === 'day'
      ? req.body.date
      : req.body.startDate + req.body.endDate)

  try {
    const registeredConfig = await db
      .collection('sharedConfigs')
      .findOne({ _id: id })

    if (registeredConfig) {
      res.json({ success: true, configId: registeredConfig._id })
      return
    }

    const data = {
      type: req.body.type,
      startDate: req.body.type === 'day' ? req.body.date : req.body.startDate,
      endDate: req.body.type === 'day' ? req.body.date : req.body.endDate,
      userId: req.session.user.id,
      _id: id
    }

    await db.collection('sharedConfigs').insertOne(data)

    res.json({ success: true, configId: data._id })
  } catch {
    sendErrorResponse(res, 500, 'general', 'Could not initiate share')
  }
})

router.get('', async (req, res) => {
  const db = req.app.locals.db

  const configId = req.query.configId

  try {
    const config = await db
      .collection('sharedConfigs')
      .findOne({ _id: configId })

    if (!config) {
      sendErrorResponse(res, 500, 'general', 'Could not fetch shared schedule')
      return
    }

    const user = await db
      .collection('users')
      .findOne({ _id: ObjectId(config.userId) })

    if (!user) {
      sendErrorResponse(res, 500, 'general', 'Could not fetch shared schedule')
      return
    }

    const start = new Date(config.startDate)
    start.setHours(0, 0, 0, 0)

    const end = new Date(config.endDate)
    end.setHours(23, 59, 59, 999)

    const events = await db
      .collection('events')
      .find({ ownerId: config.userId, start: { $gte: start, $lte: end } })
      .toArray()

    const freeSlots = getFreeSlotsInRange(
      config.startDate,
      config.endDate,
      events.map(e => ({
        start: new Date(e.start),
        end: new Date(e.end)
      }))
    )

    const addColorsToEvent = event => {
      if (req.session.user && event.creatorId === req.session.user.id) {
        event.color = 'purple'
        event.textColor = 'white'
      } else if (user.preferences.areSharedEventDetailsHidden) {
        event.color = 'grey'
        event.textColor = 'grey'
      }

      return event
    }

    const result = {
      config,
      freeSlots,
      user: replaceId(user),
      events: events.map(e => replaceId(e)).map(addColorsToEvent)
    }

    res.json({ success: true, data: result })
  } catch {
    sendErrorResponse(res, 500, 'general', 'Could not fetch shared schedule')
  }
})

module.exports = router
