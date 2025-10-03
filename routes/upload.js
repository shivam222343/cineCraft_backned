import express from 'express';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// Upload single file (image or document)
router.post('/image', (req, res) => {
  // Set timeout for the request
  req.setTimeout(30000); // 30 seconds timeout
  
  upload.single('image')(req, res, async (err) => {
    try {
      // Handle multer errors
      if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({
          success: false,
          message: err.message || 'File upload error',
          error: err.code || 'UPLOAD_ERROR'
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file provided'
        });
      }

      // Cloudinary automatically uploads the file and provides the URL
      const fileUrl = req.file.path;
      const publicId = req.file.filename;
      const fileType = req.file.mimetype;
      const isImage = fileType.startsWith('image/');
      const isDocument = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'].includes(fileType);

      console.log('File uploaded successfully:', {
        originalName: req.file.originalname,
        fileType: fileType,
        size: req.file.size,
        url: fileUrl
      });

      res.status(200).json({
        success: true,
        message: `${isImage ? 'Image' : 'Document'} uploaded successfully`,
        url: fileUrl, // For backward compatibility
        data: {
          url: fileUrl,
          publicId: publicId,
          originalName: req.file.originalname,
          size: req.file.size,
          fileType: fileType,
          isImage: isImage,
          isDocument: isDocument
        }
      });

    } catch (error) {
      console.error('Upload processing error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process uploaded file',
        error: error.message
      });
    }
  });
});

// Upload multiple images
router.post('/images', upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image files provided'
      });
    }

    const uploadedImages = req.files.map(file => ({
      url: file.path,
      publicId: file.filename,
      originalName: file.originalname,
      size: file.size
    }));

    res.status(200).json({
      success: true,
      message: `${req.files.length} images uploaded successfully`,
      data: uploadedImages
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload images',
      error: error.message
    });
  }
});

export default router;
