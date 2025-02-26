import { getUserDetails, login, logout, refreshJWTToken, signup } from '../controller/authController.js';
import express from 'express'
import verifyUser from '../middleware/verifyUser.js';

const router = express()

//athentication
router.post('/signup',signup)
router.post('/login', login)
router.get('/user/refresh', refreshJWTToken)
router.get('/protected', verifyUser)
router.get('/user',verifyUser, getUserDetails)
router.post('/user/logout',verifyUser, logout)

export default router