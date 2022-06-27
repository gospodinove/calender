function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next()
  } else {
    next({ status: 401, message: `Unauthorized access` })
  }
}

module.exports = isAuthenticated
