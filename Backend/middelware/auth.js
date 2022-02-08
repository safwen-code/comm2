const config = require('../config/default.json')
const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
  try {
    //get Token from headers
    const token = req.header('x-auth-token')
    //check for token
    if (!token) {
      return res.status(401).json({ msg: 'no token authorization' })
    }
    //verify token
    const decode = jwt.verify(token, config.pass)
    // add user from payload of token
    req.user = decode.user
    next()
  } catch (error) {
    res.status(500).json({ msg: 'token is not valid' })
  }
}
module.exports = auth
