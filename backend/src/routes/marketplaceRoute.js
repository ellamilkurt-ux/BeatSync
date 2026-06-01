const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { addToCart, addToWishlist, processPayment } = require('../controller/marketplaceController');

// All marketplace routes require authentication
router.post('/cart', verifyToken, addToCart);
router.post('/wishlist', verifyToken, addToWishlist);
router.post('/checkout', verifyToken, processPayment);

module.exports = router;
