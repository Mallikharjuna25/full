const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const eventStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'eventnexus/events',
        allowedFormats: ['jpg', 'jpeg', 'png', 'webp']
    }
});

const avatarStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'eventnexus/avatars',
        allowedFormats: ['jpg', 'jpeg', 'png', 'webp']
    }
});

const idProofStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'eventnexus/id-proofs',
        allowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'pdf']
    }
});

const uploadEventImages = multer({ storage: eventStorage }).fields([
    { name: 'bannerImage', maxCount: 1 },
    { name: 'images', maxCount: 4 }
]);

const uploadAvatar = multer({ storage: avatarStorage }).single('avatar');
const uploadIdProof = multer({ storage: idProofStorage }).single('idProofImage');
const uploadLocal = multer({ storage: multer.memoryStorage() });

module.exports = { uploadEventImages, uploadAvatar, uploadIdProof, uploadLocal };
