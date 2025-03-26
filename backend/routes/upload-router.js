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

})

module.exports = uploadRouter;