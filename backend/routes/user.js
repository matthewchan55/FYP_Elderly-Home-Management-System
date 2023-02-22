const express = require('express')
const { loginUser, signupUser, updateProfileUser } = require('../controllers/userController')

const router = express.Router()

// login route
router.post('/login', loginUser)

// signin route
router.post('/signup', signupUser)

// get user data
router.patch('/profile/:id', updateProfileUser)

module.exports = router
