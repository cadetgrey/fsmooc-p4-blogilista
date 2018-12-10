const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  passwordHash: String,
  isOfAge: Boolean
})


userSchema.statics.format = (user) => {
  return {
    username: user.username,
    name: user.name,
    isOfAge: user.isOfAge
  }
}

const User = mongoose.model('User', userSchema)

module.exports = User

