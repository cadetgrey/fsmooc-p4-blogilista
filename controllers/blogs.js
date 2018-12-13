const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
  res.json(blogs.map(Blog.format))
})

blogsRouter.post('/', async (req, res) => {
  const body = req.body

  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)

    // validation
    if (!req.token || !decodedToken.id) {
      return res.status(401).json({ error: 'missing or invalid token' })
    }

    if (!body.title || !body.url) {
      return res.status(400).json({ error: 'mandatory information missing, check title and url' })
    }

    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    res.status(201).json(Blog.format(savedBlog))
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ error: error.message })
    } else {
      res.status(500).send({ error: error.message })
    }
  }
})

blogsRouter.put('/:id', async (req, res) => {
  try {
    const changedBlog = { ...req.body }
    const returnedBlog = await Blog.findByIdAndUpdate(req.params.id, changedBlog, { new: true })
    
    res.status(200).json(Blog.format(returnedBlog))
  } catch (error) {
    console.log(error)
    res.status(400).send({ error: 'id not found' })
  }
})

blogsRouter.delete('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
    const decodedToken = jwt.verify(req.token, process.env.SECRET)

    if (!req.token || !decodedToken.id) {
      return res.status(401).json({ error: 'missing or invalid token' })
    }

    if (blog.user.toString() !== decodedToken.id) {
      return res.status(401).json({ error: 'unauthorised user' })
    }

    await blog.remove()
    return res.status(204).end()
  } catch (error) {
    console.log(error)
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ error: error.message })
    } else {
      res.status(500).send({ error: error.message})
    }
  }
})

module.exports = blogsRouter