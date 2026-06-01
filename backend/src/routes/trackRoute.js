const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
    getAllTracks,
    uploadTrack,
    streamTrack,
    buyTrack,
    reactToTrack
} = require('../controller/trackController');

router.get('/', getAllTracks);
router.post('/', verifyToken, uploadTrack);
router.get('/:id/stream', streamTrack);
router.post('/:id/buy', verifyToken, buyTrack);
router.post('/:id/react', verifyToken, reactToTrack);

module.exports = router;

