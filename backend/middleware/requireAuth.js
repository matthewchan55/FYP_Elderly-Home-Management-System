const jwt = require("jsonwebtoken")
const User = require('../models/userModel')

const requireAuth = async(req, res, next) => {

  // verify authentication
  const { authorization } = req.headers

  if(!authorization){
    return res.status(401).json({error: 'Authorization token required'})
  }

  const token = authorization.split(' ')[1]
  //console.log(token)
  try {
    // when login, it will generate the token -> then find the user with this authorization token
    const {_id} = jwt.verify(token, process.env.SECRET)
    // attach user object in requests
    req.user = await User.findOne({ _id }).select('_id')
    // allow move on to next function
    next()
    
  } catch (error) {
    console.log(error)
    res.status(401).json({error: 'Request is not authorized'})
  }

};

module.exports = requireAuth
