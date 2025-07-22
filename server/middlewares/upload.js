

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'barcodes', // 👈 all files will go to this Cloudinary folder
    allowed_formats: ['png', 'jpg'],
    public_id: (req, file) => `${Date.now()}-${file.originalname.split('.')[0]}`
  },
});

const upload = multer({ storage });

module.exports = upload;
