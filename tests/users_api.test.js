const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const User = require('../models/user')
const helper = require('./tests_helper')

describe('when there are users saved in the database', async () => {

  // figure out how to create proper users here (password hash etc)
  beforeAll(async () => {
  })

  test('GET request to /api/users returns a list of all users as JSON', async () => {
    const usersInitially = await helper.usersInDb() // write helpers, refactor helper file if necessary
    console.log(usersInitially)

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
  test('POST request to /api/users successfully adds a new user and returns 201', async () => {
    const usersInitially = await helper.usersInDb()

    const newUser = {
      username: 'esimerkki',
      name: 'kayttaja',
      password: 'sanasala',
      isOfAge: false
    }

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
})

afterAll(() => {
  server.close()
})