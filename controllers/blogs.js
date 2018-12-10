const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs)
})

blogsRouter.post('/', async (req, res) => {
  try {
    const body = req.body

    // tänne validaatioita tai jotain, lunttaa kolmososasta
    // validaatiot ja async/await?
    if (!body.title || !body.url) {
      return res.status(400).json({ error: 'mandatory information missing, check title and url' })
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0
    })

    const savedBlog = await blog.save()
    res.status(201).json(savedBlog)
  } catch (error) {
    console.log(error)
    res.status(500).send({ error })
  }
})

blogsRouter.put('/:id', async (req, res) => {
  try {
    const changedBlog = { ...req.body }

    const returnedBlog = await Blog.findOneAndUpdate(req.params.id, changedBlog, { new: true })
    res.status(200).json(returnedBlog)
  } catch (error) {
    console.log(error)
    res.status(400).send({ error: 'id not found' })
  }
})

blogsRouter.delete('/:id', async (req, res) => {
  try {
    await Blog.findByIdAndRemove(req.params.id)
    res.status(204).end()
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'id not found'})
  }
})

module.exports = blogsRouter