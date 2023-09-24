const jwt = require('jsonwebtoken')

const cookieJwtAuth = (req, res, next) => {
  const token = req.cookies.sessionId
  console.log(token, 'token')
  try {
    const user = jwt.verify(token, 'mySecretKey123456')
    req.user = user
    next()
  } catch (err) {
    res.clearCookie('sessionId')
    res.status(401).json({ error: 'Authentication failed', status: 401 })
  }
}

module.exports = cookieJwtAuth
