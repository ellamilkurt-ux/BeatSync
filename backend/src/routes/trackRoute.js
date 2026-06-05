const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let dest = path.join(__dirname, '../../uploads');
        if (file.fieldname === 'track_file') {
            dest = path.join(dest, 'music');
        } else if (file.fieldname === 'cover_file') {
            dest = path.join(dest, 'covers');
        }
        fs.mkdirSync(dest, { recursive: true });
        cb(null, dest);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });
const cpUpload = upload.fields([{ name: 'track_file', maxCount: 1 }, { name: 'cover_file', maxCount: 1 }]);

const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const { 
    getAllTracks, 
    uploadTrack, 
    streamTrack, 
    buyTrack, 
    reactToTrack,
    getTrackReviews,
    addTrackReview,
    updateTrack,
    deleteTrack,
    getPurchasedTracks,
    getArtistSales,
    getAllGenres,
    createGenre
} = require('../controller/trackController');

router.get('/', getAllTracks);
router.get('/genres', getAllGenres);
router.post('/genres', verifyToken, verifyAdmin, createGenre);
router.get('/purchased', verifyToken, getPurchasedTracks);
router.get('/sales', verifyToken, getArtistSales);
router.post('/', verifyToken, cpUpload, uploadTrack);
router.get('/:id/stream', streamTrack);
router.post('/:id/buy', verifyToken, buyTrack);
router.post('/:id/react', verifyToken, reactToTrack);
router.get('/:id/reviews', getTrackReviews);
router.post('/:id/reviews', verifyToken, addTrackReview);
router.put('/:id', verifyToken, cpUpload, updateTrack);
router.delete('/:id', verifyToken, deleteTrack);

module.exports = router;
