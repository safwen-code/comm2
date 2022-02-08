const mongoose = require('mongoose')
const config = require('./default.json')

const ConnectDB = async () => {
  try {
    const db = await mongoose.connect(config.mogoUri)
    console.log('connect db')
  } catch (error) {
    console.error(error.message)
    console.log('Problem with mongoose')
  }
}

module.exports = ConnectDB
