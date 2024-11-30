const express = require('express');
const uploadRouter = express.Router();


const upload = require('../middlewares/upload');


uploadRouter.post('/upload', upload.single('image'), (req, res) => {
    const file = req.file; // Assuming you're using multer to handle uploads
    if (!file) {
      return res.status(400).send('No file uploaded.');
    }

    const publicURL = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
    res.json({ imagePath: publicURL }); // Send public URL in the response


    // try {
    //     res.status(200).json({
    //         message: 'Image uploaded successfully!',
    //         filePath: `/uploads/${req.file.filename}`, // File path to serve the image
    //     });
    // } catch (error) {
    //     res.status(500).json({ message: 'Upload failed', error: error.message });
    // }
})

module.exports = uploadRouter;