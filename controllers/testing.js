const testingRouter = require('express').Router()
const Note = require('../models/notes')
const User = require('../models/users')

testingRouter.post('/reset', async (request, response) => {
  await Note.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = testingRouter