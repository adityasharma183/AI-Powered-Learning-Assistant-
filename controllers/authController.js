import jwt from 'jsonwebtoken'
import User from '../models/Users.js'



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
        const {username,email,password } =req.body
        // check if user exists
        const userExists=await User.findOne({$or:[{email}]});
        if(userExists){
           return res.status(400).json({
                success:false,
                error:
                userExists.email===email?
                "Email already exists":
                "Username already taken",
                statusCode:400,
            })
        }

        // create user
        const user=await User.create({username,email,password});

        //generate token
        const token=generateToken(user.id)
        res.status(201).json({
            success:true,
            data:{
                user:{
                    id:user.id,
                    username:user.username,
                    email:user.email,
                    profileImage:user.profileImage,
                    createdAt:user.createdAt

                },
                token,
            },
            message:'user registered successfully'
        });



        

    } catch (error) {
        next(error)
        
    }
}

//@desc login user
//@route POST/api/auth/login
//@access Public

export const login=async(req,res,next)=>{
    try {

        const {email,password}=req.body

        //validate input 
        if(!email || !password){
            return res.status(401).json({
                success:false,
                error:'Enter valid password or email',
                statusCode:401
            })
        }
        //check for user(including password)
        const user= await User.findOne({email}).select("+password");

        if(!user){
            return res.status(401).json({
                success:false,
                error:'Invalid credentials',
                statusCode:401
            });
        }

        //compare password

        const isMatch=await user.matchPassword(password)
        if(!isMatch){
            return res.status(401).json({
                success:false,
                error:'Invalid credentials',
                statusCode:401
            });
        }

        //generate token
        const token=await generateToken(user.id)
        res.status(200).json({
            success:true,
            user:{
                id:user.id,
                username:user.username,
                email:user.email,
                profileImage:user.profileImage
            },
            token,
            message :'login successfully'

        })
        
    } catch (error) {
        next(error)
        
    }
}

//@desc=>  get the user profile
//@route POST/api/auth/profile
//@access  Protected

export const getProfile=async(req,res,next)=>{
    try {
        const user =await User.findById(req.user._id)
        res.status(200).json({
            success:true,
            data:{
                id:user._id,
                username:user.username,
                email:user.email,
                profileImage:user.profileImage,
                createdAt:user.createdAt,
                updateAt:user.updatedAt
            },
            
        })
        
    } catch (error) {
         next(error)
        
    }
}

//@desc=>  get the user profile
//@route POST/api/auth/profile
//@access  Protected

export const updateProfile=async(req,res,next)=>{
    try {
        const {username,email,profileImage}=req.body
        const user=await User.findById(req.user._id)
        if(username) user.username=username
        if(email) user.email=email
        if(profileImage)user.profileImage=profileImage

        await user.save();
        res.status(200).json({
            success:true,
            data:{
                id:user._id,
                username:user.username,
                email:user.email,
                profileImage:user.profileImage
            },
            message:'Profile updated successfully'
        })

        
    } catch (error) {
         next(error)
        
    }
}


//@desc=>  change password
//@route POST/api/auth/change-password
//@access  Protected



export const changePassword=async(req,res,next)=>{
    try {
        const {currentPassword,newPassword}=req.body
        if(!currentPassword || !newPassword){
            return res.status(400).json({
                success:false,
                error:'Please provide  current password or new password',
                statusCode:400,

            })
        }
        const user=await User.findById(req.user._id).select("+password")
        //check password
        const isMatch=await user.matchPassword(currentPassword)
        if(!isMatch){
            return res.status(401).json({
                success:false,
                error:'Password mismatch nigga',
                statusCode:401
            })
        }

        //update password
        user.password=newPassword
        await user.save();

        res.status(200).json({
            success:true,
            message :"Password changed successfully"
        })
    } catch (error) {
         next(error)
        
    }
}

