import express from 'express'
const router=express.Router()
import {body } from 'express-validator'
import {
    register,
    login,
    updateProfile,
    getProfile,
    changePassword
} from '../controllers/authController.js'

import protect from '../middlewares/authMiddleware.js'

//Validation middleware

const registerValidation=[
    body('username')
    .trim()
    .isLength({min:3})
    .withMessage('Username should be at least 3 characters'),

    body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter  a valid email'),

    body('password')
    .notEmpty()
    .isLength({min:6})
    .withMessage('Password should be at least 6 characters')
]

//login middleware

const loginValidation=[
    body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('please enter a  valid mail'),

    body('password')
    .notEmpty()
    .withMessage('Enter a valid password')
]

//public routes
router.post('/register',registerValidation,register)
router.post('/login',loginValidation,login)

//protected routes
router.get('/profile',protect,getProfile)
router.put('/profile',protect,updateProfile)
router.post('/change-password',protect,changePassword)

export default router