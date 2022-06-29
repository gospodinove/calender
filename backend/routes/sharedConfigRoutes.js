const express = require('express')
const isAuthenticated = require('../middleware/isAuthenticated')
const { sendErrorResponse } = require('../utils')

const router = express.Router()

router.post('', isAuthenticated, async (req, res) => {
  const db = req.app.locals.db
  const id =
    req.session.user.id +
    (req.body.type === 'day'
      ? req.body.date
      : req.body.startDate + req.body.endDate)

  try {
    const data = { ...req.body, userId: req.session.user.id, _id: id }

    const registeredConfig = await db
      .collection('sharedConfigs')
      .find({ _id: id })
      .toArray()

    if (registeredConfig.length > 0) {
      res.json({ success: true, configId: registeredConfig[0]._id })
      return
    }

    await db.collection('sharedConfigs').insertOne(data)

    res.json({ success: true, configId: data._id })
  } catch (err) {
    sendErrorResponse(res, 500, 'general', 'Could not initiate share')
  }
})

module.exports = router
