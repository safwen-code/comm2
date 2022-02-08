const mongoose = require('mongoose')
const schema = mongoose.Schema

const UserSchema = new schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

module.exports = User = mongoose.model('user', UserSchema)
