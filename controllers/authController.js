import jwt from 'jsonwebtoken'
import user from '../models/Users.js'


//generate jwt token
const generateToken=(id)=>{

    return jwt.sign({id},process.env.JWT_CODE,{
        expiresIn:process.env.JWT_EXPIRE || '7d',
    })

}

//@desc Register new user
//@route  POST/api/auth/register
//@access Public

export const register=async(req,res,next)=>{
    try {
        
    } catch (error) {
        next(error)
        
    }
}

//@desc login user
//@route POST/api/auth/login
//@access Public

export const login=async(req,res,next)=>{
    try {
        
    } catch (error) {
        next(error)
        
    }
}

//@desc=>  get the user profile
//@route POST/api/auth/profile
//@access  Protected

export const getProfile=async(req,res,next)=>{
    try {
        
    } catch (error) {
         next(error)
        
    }
}

//@desc=>  get the user profile
//@route POST/api/auth/profile
//@access  Protected

export const updateProfile=async(req,res,next)=>{
    try {
        
    } catch (error) {
         next(error)
        
    }
}


//@desc=>  change password
//@route POST/api/auth/change-password
//@access  Protected



export const changePassword=async(req,res,next)=>{
    try {
        
    } catch (error) {
         next(error)
        
    }
}

