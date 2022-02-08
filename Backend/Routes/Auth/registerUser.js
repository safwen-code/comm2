const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const config = require('../../config/default.json')
const jwt = require('jsonwebtoken')
const User = require('../../Model/User')

//register user

router.post('/register', async (req, res) => {
  try {
    //take variabel from body
    const { name, email, password } = req.body
    //check if the user is exisete
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ msg: `${name} is all ready exist` })
    }
    //prepare new instace from User
    user = new User({
      name,
      email,
      password,
    })
    //hash password and save data User
    const salt = bcrypt.genSaltSync(10)
    user.password = bcrypt.hashSync(password, salt)
    await user.save()
    // res.status(201).json({ user })
    //return jsonwebToken
    //create object
    const payload = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    }
    //send token
    jwt.sign(payload, config.pass, { expiresIn: 36000 }, (err, token) => {
      if (err) throw err
      res.status(200).json({ token, name, email })
    })
  } catch (error) {
    console.error(error.message)
  }
})

module.exports = router
