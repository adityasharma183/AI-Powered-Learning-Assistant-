import mongoose from "mongoose";
import Document from "../models/documentHistory.js";
import FlashCard from "../models/FlashCard.js";
import Quiz from "../models/Quiz.js"
import {extractTextFromPdf} from '../utils/pdfParser.js'
import { chunkText, findRelevantChunks } from '../utils/textChunker.js';

import fs from 'fs/promises'
import { log } from "console";

//@desc upload a pdf
//@route POST/api/documents/upload
//@Access Private

export const uploadDocument=async (req,res,next)=>{
    try {
        //if pdf is not uploaded
        if(!req.file){
            return res.status(400).json({
                success:false,
                error:'Please upload a PDF file',
                statusCode:400
            })

        }
        //delete pdf if it has no title
        const {title}=req.body
        if(!title){
            await fs.unlink(req.file.path)
            return res.status(400).json({
                success:false,
                error:'Please provide a valid title',
                statusCode:400
            })
        }
        //construct the URL for the uploaded files

        const baseUrl=`http://localhost:${process.env.PORT || 8000}`
        const fileUrl=`${baseUrl}/uploads/documents/${req.file.filename}`

        //create document record
        const document=await Document.create({
            userId:req.user._id,
            title,
            fileName:req.user.originalName,
            filePath:fileUrl,//store the url instead of local path
            fileSize:req.file.size,
            status:'processing'

        })
        //process pdf in background
        processPDF(document._id,req.file.path).catch(err=>{
            console.log('error in document processing',err);
            
        })
        res.status(201).json({
            success:true,
            data:document,
            message:'Document uploaded successfully'
        })

        //helper function to processPDF
        const processPDF=async (documentId,filePath)=>{
            try {
                const {text} =await extractTextFromPdf(filePath)

                //create chunks 
                const chunks =chunkText(text,50,50)

                //update document
                await Document.findByIdAndDUpdate(documentId,{
                    extractedText:text,
                    chunks:chunks,
                    status:'ready'
                })
                console.log(`Document ${documentId} processed successfully `);
                

                
            } catch (error) {
                console.error(`Error processing document ${documentId}`)

                await Document.findByIdAndUpdate(documentId,{
                    status:failed
                })
                
            }

        }

        
    } catch (error) {
        //clean up file on error
        if(req.file){
            await fs.unlink(req.file.path).catch(()=>{})

        }
        next(error)
        
    }
}

//@desc  get all user documents
//@route  GET/api/documents/
//@Access Private

export const getDocuments=async (req,res,next)=>{
    try {
        
    } catch (error) {
        
    }
}


//@desc  get single document with chunks
//@route GET/api/documents/:id
//@Access Private

export const getDocument=async (req,res,next)=>{
    try {
        
    } catch (error) {
        
    }

}

//@desc  update a particular document
//@route PUT/api/documents/:id
//@Access Private

export const updateDocument=async (req,res,next)=>{
    try {
        
    } catch (error) {
        
    }
}

//@desc  delete a particular document
//@route DELETE/api/documents/:id
//@Access Private

export const deleteDocument=async (req,res,next)=>{
    try {
        
    } catch (error) {
        
    }
}






