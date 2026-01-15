import mongoose from 'mongoose'
const flashCardSchema=new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    documentId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Document'
    },
    quiz:[
        {
            question:{type:String,required:true},
            answer:{type:String,required:true},
            difficulty:{
                type:String,
                enum:['Easy','Medium','Hard'],
                default:'Medium'
            },
            lastReviewed:{type:String,default:null},
            reviewCount:{type:Number,default:0},
            isStarred:{type:Boolean,default:false},
        }
    ]


},{
    timestamps:true,
})

 flashCardSchema.index({userId:1,documentId:1})

const FlashCard=mongoose.model('FlashCard',flashCardSchema)
export default FlashCard

