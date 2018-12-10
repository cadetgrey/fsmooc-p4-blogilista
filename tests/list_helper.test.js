const listHelper = require('../utils/list_helper')
const blogs = require('./bloglist_for_tests').blogs

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

  test('of a bigger list is calculated correctly', () => {
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(36)
  })
})

describe('favourite blog', () => {
  test('of empty list is empty object', () => {
    const result = listHelper.favouriteBlog([])
    expect(result).toEqual({})
  })

  test(`of sample list to be ${blogs[2].title} by ${blogs[2].author}`, () => {
    const result = listHelper.favouriteBlog(blogs)
    expect(result).toEqual({
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12
    })
  })
})

describe('most blogs', () => {
  test(`of sample list to be ${blogs[3].author}`, () => {
    const result = listHelper.mostBlogs(blogs)
    expect(result).toEqual({
      author: "Robert C. Martin",
      blogs: 3
    })
  })
})

describe('most likes', () => {
  test(`of sample list to be ${blogs[1].author}`, () => {
    const result = listHelper.mostLikes(blogs)
    expect(result).toEqual({
      author: "Edsger W. Dijkstra",
      likes: 17
    })
  })
})