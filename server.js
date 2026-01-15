import dotenv from 'dotenv'
dotenv.config()
import express, { urlencoded } from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { error } from 'console'
import errorHandler from './middlewares/errorMiddleware.js'
import connectDB from './config/db.js'
import authRoute from './routes/authRoute.js'

// ES 6 module dirname alternative
const __filename=fileURLToPath(import.meta.url)
const __dirname=path.dirname(__filename)

// initialize express app
const app=express();

//DB Connection
connectDB();

// Middlewares to handle cores
app.use(cors({
    origin:"*",
    methods:["POST","GET","DELETE","PUT"],
    allowedHeaders:["Content-Type","Authorization"],
    credentials:true

}))

app.use(express.json());
app.use (urlencoded({extended:true}))

// static files for upload 
app.use('/uploads',express.static(path.join(__dirname,'uploads')))

//routes 
app.use(errorHandler)
app.use('/api/auth',authRoute)

//404 handler
app.use((req,res)=>{
    res.status(404).json({
        success:false,
        error:'Route not found',
        statusCode :404

    });
});

//Start server
const PORT=process.env.PORT || 8000


app.listen(PORT,()=>{
    console.log(`bro running on ${process.env.NODE_ENV} mode on ${PORT}`);
    
})

process.on('unhandledRejection',(err)=>{
    console.error(`Error:${err.message}`);
    process.exit(1);
})