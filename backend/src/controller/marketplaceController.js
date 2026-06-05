const pool = require('../database/db');
const crypto = require('crypto');

// ─────────────────────────────────────────────
// POST /api/marketplace/cart
// Verifies the track exists, then confirms it
// can be added to the user's cart. Cart state is
// stored in the `interactions` table (type: 'cart')
// with a UNIQUE guard to prevent duplicates.
// ─────────────────────────────────────────────
const addToCart = async (req, res) => {
    const { track_id } = req.body;
    const user_id = req.user.id;

    if (!track_id) {
        return res.status(400).json({ message: 'track_id is required.' });
    }

    try {
        // 1. Verify the track exists and fetch its details
        const trackResult = await pool.query(
            'SELECT id, title, price FROM tracks WHERE id = $1',
            [track_id]
        );

        if (trackResult.rows.length === 0) {
            return res.status(404).json({ message: 'Track not found.' });
        }

        const track = trackResult.rows[0];

        // 2. Check if user already has this track in their cart
        const existing = await pool.query(
            `SELECT id FROM interactions
             WHERE user_id = $1 AND track_id = $2 AND type = 'cart'`,
            [user_id, track_id]
        );

        if (existing.rows.length > 0) {
            return res.status(409).json({ message: 'Track is already in your cart.' });
        }

        // 3. Check if the user already purchased this track
        const purchased = await pool.query(
            `SELECT id FROM orders
             WHERE buyer_id = $1 AND track_id = $2 AND status = 'paid'`,
            [user_id, track_id]
        );

        if (purchased.rows.length > 0) {
            return res.status(409).json({ message: 'You already own this track.' });
        }

        // 4. Insert cart entry into interactions
        const cartEntry = await pool.query(
            `INSERT INTO interactions (user_id, track_id, type)
             VALUES ($1, $2, 'cart')
             RETURNING id, created_at`,
            [user_id, track_id]
        );

        return res.status(201).json({
            message: 'Track added to cart.',
            cart_item: {
                cart_entry_id: cartEntry.rows[0].id,
                track_id: track.id,
                title: track.title,
                price: track.price,
                added_at: cartEntry.rows[0].created_at
            }
        });
    } catch (error) {
        console.error('Add to Cart Error:', error);
        return res.status(500).json({ message: 'Server error while adding to cart.' });
    }
};
// for changes
// ─────────────────────────────────────────────
// POST /api/marketplace/wishlist
// Inserts a row into interactions (type: 'wishlist').
// A UNIQUE check prevents duplicate wishlist entries.
// ─────────────────────────────────────────────
const addToWishlist = async (req, res) => {
    const { track_id } = req.body;
    const user_id = req.user.id;

    if (!track_id) {
        return res.status(400).json({ message: 'track_id is required.' });
    }

    try {
        // 1. Verify the track exists
        const trackResult = await pool.query(
            'SELECT id, title, genre, price FROM tracks WHERE id = $1',
            [track_id]
        );

        if (trackResult.rows.length === 0) {
            return res.status(404).json({ message: 'Track not found.' });
        }

        const track = trackResult.rows[0];

        // 2. Guard against duplicate wishlist entries
        const existing = await pool.query(
            `SELECT id FROM interactions
             WHERE user_id = $1 AND track_id = $2 AND type = 'wishlist'`,
            [user_id, track_id]
        );

        if (existing.rows.length > 0) {
            return res.status(409).json({ message: 'Track is already in your wishlist.' });
        }

        // 3. Insert wishlist entry
        const wishlistEntry = await pool.query(
            `INSERT INTO interactions (user_id, track_id, type)
             VALUES ($1, $2, 'wishlist')
             RETURNING id, created_at`,
            [user_id, track_id]
        );

        return res.status(201).json({
            message: 'Track added to wishlist.',
            wishlist_item: {
                wishlist_entry_id: wishlistEntry.rows[0].id,
                track_id: track.id,
                title: track.title,
                genre: track.genre,
                price: track.price,
                added_at: wishlistEntry.rows[0].created_at
            }
        });
    } catch (error) {
        console.error('Add to Wishlist Error:', error);
        return res.status(500).json({ message: 'Server error while adding to wishlist.' });
    }
};

// ─────────────────────────────────────────────
// POST /api/marketplace/checkout
// Simulates a full payment pipeline:
//   1. Validates the track exists and fetches price
//   2. Guards against re-purchasing an owned track
//   3. Generates a unique transaction_id
//   4. Inserts a 'paid' order record
//   5. Removes the track from the user's cart (cleanup)
//   6. Returns a mock secure download token
// ─────────────────────────────────────────────
const processPayment = async (req, res) => {
    const { track_id } = req.body;
    const user_id = req.user.id;

    if (!track_id) {
        return res.status(400).json({ message: 'track_id is required.' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Lock and fetch track for the duration of the transaction
        const trackResult = await client.query(
            'SELECT id, title, price, artist_id FROM tracks WHERE id = $1 FOR SHARE',
            [track_id]
        );

        if (trackResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Track not found.' });
        }

        const track = trackResult.rows[0];

        // 2. Prevent purchasing your own track
        if (track.artist_id === user_id) {
            await client.query('ROLLBACK');
            return res.status(403).json({ message: 'You cannot purchase your own track.' });
        }

        // 3. Prevent duplicate purchases
        const alreadyOwned = await client.query(
            `SELECT id FROM orders
             WHERE buyer_id = $1 AND track_id = $2 AND status = 'paid'`,
            [user_id, track_id]
        );

        if (alreadyOwned.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(409).json({ message: 'You already own this track.' });
        }

        // 4. Generate a cryptographically unique transaction ID
        const transaction_id = `TXN-${Date.now()}-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;

        // 5. Insert paid order
        const orderResult = await client.query(
            `INSERT INTO orders (buyer_id, track_id, amount, status, transaction_id)
             VALUES ($1, $2, $3, 'paid', $4)
             RETURNING id, amount, status, transaction_id, created_at`,
            [user_id, track_id, track.price, transaction_id]
        );

        const order = orderResult.rows[0];

        // 6. Remove from cart if it was there (cleanup)
        await client.query(
            `DELETE FROM interactions
             WHERE user_id = $1 AND track_id = $2 AND type = 'cart'`,
            [user_id, track_id]
        );

        await client.query('COMMIT');

        // 7. Generate a mock time-limited download token (not persisted — for demo only)
        const downloadToken = Buffer.from(
            JSON.stringify({ order_id: order.id, user_id, track_id, exp: Date.now() + 15 * 60 * 1000 })
        ).toString('base64');

        return res.status(200).json({
            message: 'Payment successful. Your track is ready.',
            order: {
                order_id: order.id,
                track_id: Number(track_id),
                title: track.title,
                amount_paid: order.amount,
                status: order.status,
                transaction_id: order.transaction_id,
                purchased_at: order.created_at
            },
            download: {
                token: downloadToken,
                expires_in: '15 minutes',
                note: 'Use this token with GET /api/marketplace/download to access your file.'
            }
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Payment Error:', error);
        return res.status(500).json({ message: 'Server error during checkout.' });
    } finally {
        client.release();
    }
};

const getCart = async (req, res) => {
    const user_id = req.user.id;
    try {
        const result = await pool.query(
            `SELECT t.id, t.title, t.genre, t.price, t.file_url, t.cover_url, t.artist_id, t.artist
             FROM interactions i
             JOIN tracks t ON i.track_id = t.id
             WHERE i.user_id = $1 AND i.type = 'cart'`,
            [user_id]
        );
        return res.status(200).json({ cart: result.rows });
    } catch (error) {
        console.error('Get Cart Error:', error);
        return res.status(500).json({ message: 'Server error while fetching cart.' });
    }
};

const removeFromCart = async (req, res) => {
    const { trackId } = req.params;
    const user_id = req.user.id;
    try {
        await pool.query(
            `DELETE FROM interactions
             WHERE user_id = $1 AND track_id = $2 AND type = 'cart'`,
            [user_id, trackId]
        );
        return res.status(200).json({ message: 'Removed from cart.' });
    } catch (error) {
        console.error('Remove from Cart Error:', error);
        return res.status(500).json({ message: 'Server error while removing from cart.' });
    }
};

const getWishlist = async (req, res) => {
    const user_id = req.user.id;
    try {
        const result = await pool.query(
            `SELECT t.id, t.title, t.genre, t.price, t.file_url, t.cover_url, t.artist_id, t.artist
             FROM interactions i
             JOIN tracks t ON i.track_id = t.id
             WHERE i.user_id = $1 AND i.type = 'wishlist'`,
            [user_id]
        );
        return res.status(200).json({ wishlist: result.rows });
    } catch (error) {
        console.error('Get Wishlist Error:', error);
        return res.status(500).json({ message: 'Server error while fetching wishlist.' });
    }
};

const removeFromWishlist = async (req, res) => {
    const { trackId } = req.params;
    const user_id = req.user.id;
    try {
        await pool.query(
            `DELETE FROM interactions
             WHERE user_id = $1 AND track_id = $2 AND type = 'wishlist'`,
            [user_id, trackId]
        );
        return res.status(200).json({ message: 'Removed from wishlist.' });
    } catch (error) {
        console.error('Remove from Wishlist Error:', error);
        return res.status(500).json({ message: 'Server error while removing from wishlist.' });
    }
};

module.exports = { 
    addToCart, 
    addToWishlist, 
    processPayment,
    getCart,
    removeFromCart,
    getWishlist,
    removeFromWishlist
};
