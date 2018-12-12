const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')


usersRouter.get('/', async (req, res) => {
  try {
    const users = await User.find({})
    res.json(users.map(User.format))
  } catch (err) {
    console.log(err)
    // res.status(404).json({ error: 'not found'})
  }
})

usersRouter.post('/', async (req, res) => {
  try {
    const body = req.body

    // validation
    const userByUsername = await User.find({ username: body.username })
    const usernameIsUnique = userByUsername.length === 0

    if (!usernameIsUnique) {
      res.status(400).json({ error: 'Username already exists' })
    } else if (body.password.length < 3) {
      res.status(400).json({ error: 'Password must be over 3 characters long' })
    } else {
      const saltRounds = 10
      const passwordHash = await bcrypt.hash(body.password, saltRounds)

      const user = new User({
        username: body.username,
        name: body.name,
        passwordHash,
        isOfAge: body.isOfAge || true
      })

      const savedUser = await user.save()
      res.status(201).json(User.format(savedUser))
    }

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message || 'something went wrong' })
  }
})

module.exports = usersRouter