const User=require('../models/users')
const usersRouter=require('express').Router()
const bycrypt=require('bcrypt')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('notes',{ content:1,date:1 })
  response.json(users)
})


usersRouter.post('/',async(request,response) => {
  const { username,name,password }=request.body

  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return response.status(400).json({
      error: 'username must be unique'
    })
  }

  const saltRound=10
  const passwordHash=await bycrypt.hash(password,saltRound)
  const user=User({
    username,name,passwordHash
  })
  const savedUser=await user.save()
  response.status(201).json(savedUser)
})

module.exports=usersRouter