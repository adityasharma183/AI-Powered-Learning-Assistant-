import express from 'express'
import {
    uploadDocument,
    getDocuments,
    getDocument,
    
    deleteDocument,
} from '../controllers/documentController.js'
import multer from '../config/multer.js'
import protect from '../middlewares/authMiddleware.js'
import upload from '../config/multer.js'
const router=express.Router()

// all routers are protected

router.use(protect)

router.post('/upload', protect, upload.single('file'), uploadDocument)

router.get('/',getDocuments)
router.get('/:id',getDocument)

router.delete('/:id',deleteDocument)

export default router