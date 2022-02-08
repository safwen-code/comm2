const mongoose = require('mongoose')
const schema = mongoose.Schema

const PostSchema = new schema({
  user: {
    type: schema.Types.ObjectId,
    ref: 'user',
  },
  text: {
    type: String,
  },
  name: {
    type: String,
  },
  likes: [
    {
      user: {
        type: schema.Types.ObjectId,
        ref: 'user',
      },
    },
  ],
  comments: [
    {
      user: {
        type: schema.Types.ObjectId,
        ref: 'user',
      },
      text: {
        type: String,
      },
      name: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
})
module.exports = Post = mongoose.model('post', PostSchema)
