import mongoose from "mongoose";
import bcrypt, { genSalt } from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [20, "Username cannot exceed 20 characters"],
      unique: true
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address"
      ]
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false // hides password by default
    },
    profileImage:{
        type:String,
        default:null

    }

  },


  {
    timestamps: true // adds createdAt & updatedAt
  }
);



// Hash password before saving

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }
    const salt =await genSalt(10)
    this.password= await bcrypt.hash(this.password,salt)

})

//compare the password
userSchema.methods.matchPassword=async function(enteredPassword){
   return await bcrypt.compare(enteredPassword,this.password)
}

const User = mongoose.model("User", userSchema);

export default User;