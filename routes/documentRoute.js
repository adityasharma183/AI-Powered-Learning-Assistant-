import express from 'express'
import {
    uploadDocument,
    getDocuments,
    getDocument,
    updateDocument,
    deleteDocument,
} from '../controllers/documentController.js'
import multer from '../config/multer.js'
import protect from '../middlewares/authMiddleware.js'

const router=express.Router()

// all routers are protected

router.use(protect)

router.post('/upload',uploadDocument.single('file'),uploadDocument)
router.get('/',getDocuments)
router.get('/:id',getDocument)
router.put('/:id',updateDocument)
router.delete('/:id',deleteDocument)

export default router