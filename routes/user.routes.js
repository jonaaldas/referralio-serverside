import express from 'express'
import {getUserData, logInUser, registerUser, forgotPassword, updatePassowrd} from '../controllers/user.controllers.js'
import {protect} from '../middleware/authMiddleware.js'
const router = express.Router()


router.post('/register', registerUser)
router.post('/login', logInUser)
router.get('/me',protect, getUserData)
router.post('/forgot', forgotPassword)
router.post('/update-password/:token', updatePassowrd)

export default router