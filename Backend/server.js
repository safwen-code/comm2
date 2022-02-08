const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const ConnectDB = require('./config/ConnectDB')
const user = require('./Routes/Auth/registerUser')
const userLogin = require('./Routes/Auth/LoginUser')
const post = require('./Routes/Posts/post')
const { urlencoded } = require('body-parser')

//init middelware BodyParser
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const port = process.env.PORT || 5000
ConnectDB()

app.use('/user', user)
app.use('/user', userLogin)
app.use('/post', post)

app.listen(port, () => {
  console.log(`server is work in ${port}`)
})
