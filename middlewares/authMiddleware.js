import jwt from 'jsonwebtoken'
import User from '../models/Users.js'

const protect= async(req,res,next)=>{
    let token;
    //check if token exists in authorization headers
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token=req.headers.authorization.split(' ')[1]
            // verify token
            const decoded=jwt.verify(token,process.env.JWT_CODE)
            req.user=await User.findById(decoded.id).select('-password')

            if(!req.user){
                return res.status(401).json({
                    success:false,
                    error:'User not found',
                    statusCode:401

                })
            }

            next();

        }
        catch(error){
            console.log('Auth middleware error',error.message);

            if(error.name==='TokenExpiredError'){
               return  res.status(401).json({
                    success:false,
                    error:'Token Expired',
                    statusCode :401
                    

                })
            }

            return res.status(401).json({
                success:false,
                error:' Not Unauthorized,token failed ',
                statusCode:401
            })
        }
    }
    if(!token){
        return res.status(401).json({
            success:false,
            error:'No token ,no authorization',
            statusCode:401

        })
    }

}

export default protect