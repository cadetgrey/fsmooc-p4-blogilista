const Blog = require('../models/blog')
const User = require('../models/user')

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

const blogTitles = (blogs) => {
  return blogs.map(blog => blog.title)
}

module.exports = {
  initialData,
  blogsInDb,
  usersInDb
}

