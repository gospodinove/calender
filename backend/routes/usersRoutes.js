const express = require('express')
const { ObjectId } = require('mongodb')
const isAuthenticated = require('../middleware/isAuthenticated')
const { sendErrorResponse } = require('../utils')

const router = express.Router()

router.put('/preferences', isAuthenticated, async (req, res) => {
  const db = req.app.locals.db

  try {
    const userId = req.session.user.id

    await db
      .collection('users')
      .updateOne({ _id: ObjectId(userId) }, { $set: { preferences: req.body } })

    // update value in the session
    req.session.user.preferences = req.body
    req.session.save()

    res.json({ success: true })
  } catch (err) {
    sendErrorResponse(res, 500, 'general', 'Could save changes')
  }
})

module.exports = router
