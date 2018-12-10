const formattedBlog = (blog) => {
  return {
    title: blog.title,
    author: blog.author,
    likes: blog.likes
  }
}

const totalLikes = (blogs) => {
  const reducer = (acc, curr) => {
    return acc + curr.likes
  }

  return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0)
}

const favouriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return {}
  }

  const likes = blogs.map(blog => blog.likes)
  const maxLikes = Math.max.apply(Math, likes)
  const favourite = formattedBlog(blogs[likes.indexOf(maxLikes)])

  return favourite
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {}
  }

  const authors = {}
  blogs.forEach(blog => {
    if (!authors[blog.author]) {
      authors[blog.author] = {
        author: blog.author,
        blogs: 1
      }
    } else {
      authors[blog.author].blogs++
    }
  })

  const mostBlogs = Array.from(Object.values(authors)).sort((a, b) => b.blogs - a.blogs)[0]

  return mostBlogs
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return {}
  }
  const authors = {}
  blogs.forEach(blog => {
    if (!authors[blog.author]) {
      authors[blog.author] = {
        author: blog.author,
        likes: blog.likes
      }
    } else {
      authors[blog.author].likes += blog.likes
    }
  })

  const mostLikes = Array.from(Object.values(authors)).sort((a, b) => b.likes - a.likes)[0]
  
  return mostLikes
}

module.exports = {
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}