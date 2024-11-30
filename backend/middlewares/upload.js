const multer = require('multer');
const path = require('path');

const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

//setup storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // dir to save images
    },
    filename: (req, file, cb) => {
        console.log(file);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Preserve file extension
    },
});

//filter to ensure only images

const fileFilter = (req, file, cb) => {
    const fileExtension = path.extname(file.originalname).toLowerCase(); // Extract and normalize extension
    if (allowedExtensions.includes(fileExtension)) {
        cb(null, true); //accept file
    } else {
        cb(new Error('Only images are allowed!'), false); //reject file
    }
};

const upload = multer({
    storage,
    fileFilter
});


module.exports = upload;