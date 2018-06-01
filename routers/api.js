const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const mongoose = require('mongoose')
const db = 'mongodb://bobby:pwd@ds159459.mlab.com:59459/angulardb'

mongoose.connect(db, (err) => {
  if (err) {
    console.log('Error!' + err)
  } else {
    console.log('Connected to mongodb!')
  }
})

function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    res.status(401).send('Unauthorized request!')
  }
  let token = req.headers.authorization.split(' ')[1];
  if (token === 'null') {
    res.status(401).send('Unauthorized request!')
  }
  let payload = jwt.verify(token, 'secretKey')
  if (!payload) {
    res.status(401).send('Unauthorized request!')
  }
  req.userId = payload.subject
  next()
}

router.get('/', (req, res) => {
  res.send('from api router')
})

router.post('/register', (req, res) => {
  let userData = req.body
  let user = new User(userData)
  user.save((error, registeredUser) => {
    if (error) {
      console.log('Register user error!' + error)
    } else {
      let payload = { subject: user._id }
      let token = jwt.sign(payload, 'secretKey')
      res.status(200).send({ token })
      // res.status(200).send(registeredUser)
    }
  })
})

router.post('/login', (req, res) => {
  let userData = req.body
  User.findOne({ email: userData.email }, (error, user) => {
    if (error) {
      console.log('Login error!', error)
    } else {
      if (!user) {
        res.status(401).send('Invalid email!')
      } else if (user.password !== userData.password) {
        res.status(401).send('Invalid password!')
      } else {
        let payload = { subject: user._id }
        let token = jwt.sign(payload, 'secretKey')
        res.status(200).send({ token })
        // res.status(200).send(user)
      }
    }
  })
})

module.exports = router