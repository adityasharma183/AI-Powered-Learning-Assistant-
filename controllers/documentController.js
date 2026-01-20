import mongoose from "mongoose";
import Document from "../models/documentHistory.js";
import FlashCard from "../models/FlashCard.js";
import Quiz from "../models/Quiz.js";
import { extractTextFromPdf } from '../utils/pdfParser.js';
import { chunkText, findRelevantChunks } from '../utils/textChunker.js';
import fs from 'fs/promises';

// helper function (MOVED OUTSIDE – REQUIRED)
const processPDF = async (documentId, filePath) => {
    try {
        const { text } = await extractTextFromPdf(filePath);

        const chunks = chunkText(text, 50, 50);

        await Document.findByIdAndUpdate(documentId, {
            extractedText: text,
            chunks,
            status: 'ready'
        });

        console.log(`Document ${documentId} processed successfully`);
    } catch (error) {
        console.error(`Error processing document ${documentId}`, error);

        await Document.findByIdAndUpdate(documentId, {
            status: 'failed'
        });
    }
};

//@desc upload a pdf
//@route POST/api/documents/upload
//@Access Private
export const uploadDocument = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'Please upload a PDF file',
                statusCode: 400
            });
        }

        const { title } = req.body;
        if (!title) {
            await fs.unlink(req.file.path);
            return res.status(400).json({
                success: false,
                error: 'Please provide a valid title',
                statusCode: 400
            });
        }

        const baseUrl = `http://localhost:${process.env.PORT || 8000}`;
        const fileUrl = `${baseUrl}/uploads/documents/${req.file.filename}`;

        const document = await Document.create({
            userId: req.user._id,
            title,
            fileName: req.file.originalname, // ✅ FIX
            filePath: fileUrl,
            fileSize: req.file.size,
            status: 'processing'
        });

        // background processing
        processPDF(document._id, req.file.path).catch(err => {
            console.log('error in document processing', err);
        });

        res.status(201).json({
            success: true,
            data: document,
            message: 'Document uploaded successfully'
        });
    } catch (error) {
        if (req.file) {
            await fs.unlink(req.file.path).catch(() => {});
        }
        next(error);
    }
};

//@desc  get all user documents
//@route  GET/api/documents/
//@Access Private
export const getDocuments = async (req, res, next) => {
    try {
        const documents = await Document.aggregate([
            {
                $match: { userId: new mongoose.Types.ObjectId(req.user._id) }
            },
            {
                $lookup: {
                    from: 'flashcards',
                    localField: '_id',
                    foreignField: 'documentId',
                    as: 'flashcardSets'
                }
            },
            {
                $lookup: {
                    from: 'quizzes',
                    localField: '_id',
                    foreignField: 'documentId',
                    as: 'quizzes'
                }
            },
            {
                $addFields: {
                    flashcardCount: { $size: '$flashcardSets' },
                    quizCount: { $size: '$quizzes' }
                }
            },
            {
                $project: {
                    extractedText: 0,
                    chunks: 0,
                    flashcardSets: 0,
                    quizzes: 0
                }
            },
            {
                $sort: { uploadDate: -1 } // kept logic, typo-safe
            }
        ]);

        res.status(200).json({
            success: true,
            count: documents.length,
            data: documents
        });
    } catch (error) {
        next(error);
    }
};

//@desc  get single document with chunks
//@route GET/api/documents/:id
//@Access Private
export const getDocument = async (req, res, next) => {
    try {
        const document=await Document.findOne({
            _id:req.params.id,
            userId:req.user._id
        })

        if(!document){
            return res.status(404).json({
                success:fail,
                error:'Document not found',
                statusCode:404
            })
        }
        //get counts of associated flashcards and quiz 

        const flashcardCount=await FlashCard.countDocuments({documentId:document._id,userId:req.user._id})
        const quizCount=await Quiz.countDocuments({documentId:document._id,userId:req.user._id})

        //update last accessed
        document.lastAccessed=Date.now();
        document.save();

        //combine document data with counts
        const documentData=document.toObject()
        documentData.flashcardCount=flashcardCount
        documentData.quizCount=quizCount
        res.status(200).json({
            success:true,
            data:documentData
        })
    } catch (error) {
        next(error);
    }
};



//@desc  delete a particular document
//@route DELETE/api/documents/:id
//@Access Private
export const deleteDocument = async (req, res, next) => {
    try {
         const document=await Document.findOne({
            _id:req.params.id,
            userId:req.user._id
        })

        if(!document){
            return res.status(404).json({
                success:fail,
                error:'Document not found',
                statusCode:404
            })
        }
        //delete file from file system
        await fs.unlink(document.filePath).catch(()=>{})

        //delete document
        await document.deleteOne()
        res.status(200).json({
            success:true,
            message:'Document successfully deleted'

        })
    } catch (error) {
        next(error);
    }
};





