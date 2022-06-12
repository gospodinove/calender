const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const bcrypt = require('bcrypt')

const app = express()

MongoClient.connect(
  'mongodb+srv://root:root@realmcluster.hhded.mongodb.net/?retryWrites=true&w=majority'
)
  .then(client => {
    const db = client.db('calender')

    const users = db.collection('users')

    app.use(cors())
    app.use(bodyParser.json())

    app.use('/login', async (req, res) => {
      try {
        const user = await users.findOne({ email: req.body.email })

        if (!user) {
          res.status(401).json({ error: 'User does not exist' })
          return
        }

        const validPassword = await bcrypt.compare(
          req.body.password,
          user.password
        )

        if (validPassword) {
          res.send({
            token: req.body.email + req.body.password
          })
        } else {
          res.status(400).json({ error: 'Invalid Password' })
        }
      } catch (err) {
        console.log(err)
      }
    })

    app.use('/register', async (req, res) => {
      try {
        const user = await users.findOne({ email: req.body.email })

        if (user) {
          res.status(401).json({ error: 'Email is taken' })
          return
        }

        const salt = await bcrypt.genSalt(10)
        const password = await bcrypt.hash(req.body.password, salt)
        await users.insertOne({ ...req.body, password })

        res.send({
          token: req.body.email + req.body.password
        })
      } catch (err) {
        console.log(err)
      }
    })

    app.listen(8080, () =>
      console.log('API is running on http://localhost:8080')
    )
  })
  .catch(console.error)
