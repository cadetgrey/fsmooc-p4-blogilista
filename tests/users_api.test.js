const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const User = require('../models/user')
const helper = require('./tests_helper')

describe('when there are users saved in the database', async () => {
  beforeAll(async () => {
    await User.deleteMany({})

    // clean this up somehow ;_;
    const userObjects = await Promise.all(helper.initialData.users.map(user => helper.createUser(user)))

    const promiseArray = userObjects.map(user => user.save())
    await Promise.all(promiseArray)
  })

  test('GET request to /api/users returns a list of all users as JSON', async () => {
    const usersInitially = await helper.usersInDb()

    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.length).toBe(usersInitially.length)

    const usernames = response.body.map(user => user.username)

    usersInitially.forEach(user => {
      expect(usernames).toContain(user.username)
    })
  })
})

describe('adding a new user', async () => {
  const newUser = {
    username: 'esimerkki',
    name: 'kayttaja',
    password: 'sanasala',
    isOfAge: false
  }

  beforeAll(async () => {
    await User.deleteMany({})
  })

  test('POST request to /api/users successfully adds a new user and returns 201', async () => {
    const usersInitially = await helper.usersInDb()
    console.log(usersInitially)

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAfterOperation = await helper.usersInDb()
    expect(usersAfterOperation.length).toBe(usersInitially.length + 1) // this can probably be generalised?

    expect(response.body.username).toBe(newUser.username)
    expect(response.body.name).toBe(newUser.name)
  })

  test('trying to add a user with a username that already exists fails and returns 400', async () => {
    const usersInitially = await helper.usersInDb()

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .expect(res => res.error = 'Username already exists')

    const usersAfterOperation = await helper.usersInDb()
    expect(usersAfterOperation.length).toBe(usersInitially.length)
  })

  test('trying to add a user with a password length of under 3 fails and returns 400', async () => {
    const usersInitially = await helper.usersInDb()

    const anotherUser = helper.initialData.users[0]
    anotherUser.password = '12'

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .expect(res => res.error = 'Password must be over 3 characters long')

    const usersAfterOperation = await helper.usersInDb()
    expect(usersAfterOperation.length).toBe(usersInitially.length)
  })
  
})

afterAll(() => {
  server.close()
})