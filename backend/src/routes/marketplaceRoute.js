const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { 
    addToCart, 
    addToWishlist, 
    processPayment,
    getCart,
    removeFromCart,
    getWishlist,
    removeFromWishlist
} = require('../controller/marketplaceController');

// All marketplace routes require authentication
router.post('/cart', verifyToken, addToCart);
router.get('/cart', verifyToken, getCart);
router.delete('/cart/:trackId', verifyToken, removeFromCart);

router.post('/wishlist', verifyToken, addToWishlist);
router.get('/wishlist', verifyToken, getWishlist);
router.delete('/wishlist/:trackId', verifyToken, removeFromWishlist);

router.post('/checkout', verifyToken, processPayment);

module.exports = router;
