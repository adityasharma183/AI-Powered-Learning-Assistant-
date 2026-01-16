import fs from 'fs/promises'
import pdf from 'pdf-parser'

/**
 * Extract text from a PDF file
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<{ text: string, numPages: number, info: object }>}
 */
export const extractTextFromPdf = async (filePath) => {
  try {
    const dataBuffer = await fs.readFile(filePath)

    const data = await pdf(dataBuffer)

    return {
      text: data.text,
      numPages: data.numpages,
      info: data.info
    }
  } catch (error) {
    console.error('PDF parser failed:', error)
    throw new Error('Failed to extract text from PDF')
  }
}
