const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const initialData = {
  blogs: [
    {
      title: "Sankaritason juttui",
      author: "Joni", 
      url: "sliceoflife.blogspot.fi",
      likes: 5
    },
    {
      title: "Pirkko ja kaupunki",
      author: "Seija", 
      url: "elamantapa.blogspot.fi",
      likes: 6
    }
  ],
  users: [
    {
      username: "keijo11",
      name: "keijo",
      password: "salasana",
      age: "38"
    },
    {
      username: "sirpa33",
      name: "sirpa",
      password: "12341234",
      age: "45"
    }
  ]
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(Blog.format)
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(User.format)
}

const createUser = async (userInfo) => {
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(userInfo.password, saltRounds)

  return new User({
    username: userInfo.username,
    name: userInfo.name,
    passwordHash,
    isOfAge: userInfo.isOfAge || true
  })
}

const blogTitles = (blogs) => {
  return blogs.map(blog => blog.title)
}

module.exports = {
  initialData,
  blogsInDb,
  usersInDb,
  createUser
}

