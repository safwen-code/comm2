const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../../config/default.json')

const auth = require('../../middelware/auth')
const User = require('../../Model/User')

//login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    //check if the user exist by email
    let user = await User.findOne({ email })
    if (!user) {
      res
        .status(404)
        .json({ msg: ' invalid credential no user with this email' })
    }
    //if exixst
    //check the password
    const isMatch = await bcrypt.compareSync(password, user.password)
    if (!isMatch) {
      res.status(400).json({ msg: 'invalid password' })
    }
    //return jwt
    const payload = {
      user: {
        id: user.id,
        email: user.email,
      },
    }
    jwt.sign(payload, config.pass, { expiresIn: 36000 }, (err, token) => {
      if (err) throw err
      res.status(200).json({ token, email })
    })
  } catch (error) {
    console.error(error.message)
  }
})

//get current user
router.get('/me', auth, async (req, res) => {
  try {
    let user = await User.findById(req.user.id)
    // console.log(user)
    res.status(200).json(user)
  } catch (error) {
    console.error(error.message)
  }
})

//update user
//delete user
module.exports = router
