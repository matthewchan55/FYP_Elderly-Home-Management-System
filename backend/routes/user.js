const express = require('express')
const { loginUser, signupUser, updateProfileUser, fetchStaff } = require('../controllers/userController')

const router = express.Router()

// login route
router.post('/login', loginUser)

// signin route
router.post('/signup', signupUser)

// get user data
router.patch('/profile/:id', updateProfileUser)

// fetch staffs data
router.get('/management/staff', fetchStaff)


module.exports = router
