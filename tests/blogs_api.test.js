const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./tests_helper')

describe('when there are blogs saved in the database', async () => {
  
  beforeAll(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialData.blogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())

    await Promise.all(promiseArray)
  })

  test('GET request to /api/blogs returns list of all blogs as JSON', async () => {
    const blogsInDb = await helper.blogsInDb()

    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/) // mikä tää formatointi on?

    expect(response.body.length).toBe(blogsInDb.length)

    const titles = response.body.map(blog => blog.title)

    blogsInDb.forEach(blog => {
      expect(titles).toContain(blog.title)
    })
  })
})

describe('addition of a new blog', async () => {

  test('a blog can be added', async () => {
    const blogsInitially = await helper.blogsInDb()

    const newBlog = {
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfterOperation = await helper.blogsInDb()

    expect(blogsAfterOperation.length).toBe(blogsInitially.length + 1)

    const titles = blogsAfterOperation.map(blog => blog.title)

    expect(titles).toContain('React patterns')
  })

  test('if title or url missing, returns status code 400', async () => {
    const blogsInitially = await helper.blogsInDb()

    const newBlog = {
      author: 'Dolor si',
      likes: undefined
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAfterOperation = await helper.blogsInDb()

    expect(blogsAfterOperation.length).toBe(blogsInitially.length)
  })


  test('if likes missing, likes gets value of 0', async () => {
    const newBlog = {
      title: 'Lorem ipsum',
      author: 'Dolor si',
      url: 'https://amet.adipiscim.elit',
      likes: undefined
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsInDb = await helper.blogsInDb()
    console.log(blogsInDb)

    const latestAddition = blogsInDb[blogsInDb.length - 1]

    expect(latestAddition.likes).toBe(0)
  })
})

describe('editing a blog', async () => {
  let testBlog

  beforeAll(async () => {
    const blogs = await helper.blogsInDb()
    console.log(blogs)
    testBlog = blogs[blogs.length - 1]
  })

  test('PUT request to /api/blogs/:id can update likes, returns updated blog', async () => {
    const blogWithChanges = { ...testBlog }
    blogWithChanges.likes += 10

    console.log(testBlog)
    console.log(blogWithChanges)

    const resultedBlog = await api
      .put(`/api/blogs/${testBlog.id}`)
      .send(blogWithChanges)
      .expect(200)

    console.log(resultedBlog.body)

    expect(resultedBlog.body.likes).toBe(blogWithChanges.likes)
  })
})

describe('deletion of a blog', async () => {
  let testBlog

  beforeAll(async () => {
    await Blog.deleteMany({})

    testBlog = new Blog({
      title: 'Lorem ipsum',
      author: 'Dolor si',
      url: 'https://amet.adipiscim.elit',
      likes: 5
    })
    await testBlog.save()
  })

  test('DELETE request to /api/blogs/:id succeeds, returns 204', async () => {
    const blogsInitially = await helper.blogsInDb()

    await api
      .delete(`/api/blogs/${testBlog._id}`)
      .expect(204)

    const blogsAfterOperation = await helper.blogsInDb()

    const titles = blogsAfterOperation.map(blog => blog.title)

    expect(titles).not.toContain(testBlog.title)
    expect(blogsAfterOperation.length).toBe(blogsInitially.length - 1)
  })
})

afterAll(() => {
  server.close()
})