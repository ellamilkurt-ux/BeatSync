const pool = require('../database/db');
const crypto = require('crypto');

const getAllTracks = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                t.id,
                t.title,
                t.genre,
                t.price,
                t.file_url,
                t.cover_url,
                t.created_at,
                t.artist_id,
                t.artist,
                COALESCE(AVG(r.rating), 0) AS average_rating,
                COUNT(r.id) AS review_count
            FROM tracks t
            LEFT JOIN reviews r ON t.id = r.track_id
            GROUP BY t.id, t.artist, t.artist_id
            ORDER BY t.created_at DESC
        `);

        return res.status(200).json({ tracks: result.rows });
    } catch (error) {
        console.error('Get Tracks Error:', error);
        return res.status(500).json({ message: 'Server error while fetching tracks' });
    }
};

const uploadTrack = async (req, res) => {
    const artistId = req.user.id;
    const { title, genre, price, artist } = req.body;

    const userRole = req.user && req.user.role ? req.user.role.toLowerCase() : '';
    if (userRole !== 'customer' && userRole !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Only customers and admins can upload tracks.' });
    }

    if (!title || !genre || price === undefined) {
        return res.status(400).json({ message: 'All track fields are required (title, genre, price).' });
    }

    if (!req.files || !req.files['track_file'] || req.files['track_file'].length === 0) {
        return res.status(400).json({ message: 'Audio track file (track_file) is required.' });
    }

    const trackFile = req.files['track_file'][0];
    const file_url = `http://localhost:5000/uploads/music/${trackFile.filename}`;

    let cover_url = null;
    if (req.files['cover_file'] && req.files['cover_file'].length > 0) {
        const coverFile = req.files['cover_file'][0];
        cover_url = `http://localhost:5000/uploads/covers/${coverFile.filename}`;
    }

    const artistName = artist || req.user.username;

    try {
        // Check if genre is valid
        const genreCheck = await pool.query('SELECT name FROM genres WHERE LOWER(name) = LOWER($1)', [genre]);
        if (genreCheck.rows.length === 0) {
            return res.status(400).json({ message: `Genre '${genre}' is not a valid genre. Admins must create it first.` });
        }

        // Pre-check if a track with the same title exists for this artist
        const existing = await pool.query(
            'SELECT id, title, genre, price, file_url, artist_id, artist FROM tracks WHERE artist_id = $1 AND title = $2',
            [artistId, title]
        );

        if (existing.rows.length > 0) {
            return res.status(200).json({
                message: 'skipped',
                track: existing.rows[0]
            });
        }

        // Insert new track
        const result = await pool.query(
            'INSERT INTO tracks (title, genre, price, file_url, cover_url, artist_id, artist) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [title, genre, price, file_url, cover_url, artistId, artistName]
        );

        return res.status(201).json({
            message: 'Track uploaded successfully',
            track: result.rows[0]
        });
    } catch (error) {
        console.error('Upload Track Error:', error);
        return res.status(500).json({ message: 'Server error while uploading track' });
    }
};

const streamTrack = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'SELECT id, title, file_url FROM tracks WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Track not found.' });
        }

        return res.status(200).json({
            stream_url: result.rows[0].file_url
        });
    } catch (error) {
        console.error('Stream Track Error:', error);
        return res.status(500).json({ message: 'Server error while streaming track' });
    }
};

const buyTrack = async (req, res) => {
    const buyerId = req.user.id;
    const { id: trackId } = req.params;

    try {
        // 1. Fetch track details
        const trackResult = await pool.query(
            'SELECT id, title, price, artist_id FROM tracks WHERE id = $1',
            [trackId]
        );

        if (trackResult.rows.length === 0) {
            return res.status(404).json({ message: 'Track not found.' });
        }

        const track = trackResult.rows[0];

        // Prevent purchasing your own track
        if (track.artist_id === buyerId) {
            return res.status(403).json({ message: 'You cannot purchase your own track.' });
        }

        // 2. Check ownership table (orders table with status = 'paid')
        const existingOrderResult = await pool.query(
            `SELECT id, amount, status, transaction_id, created_at FROM orders
             WHERE buyer_id = $1 AND track_id = $2 AND status = 'paid'`,
            [buyerId, trackId]
        );

        if (existingOrderResult.rows.length > 0) {
            const order = existingOrderResult.rows[0];
            const downloadToken = Buffer.from(
                JSON.stringify({ order_id: order.id, user_id: buyerId, track_id: Number(trackId), exp: Date.now() + 15 * 60 * 1000 })
            ).toString('base64');

            return res.status(200).json({
                message: 'skipped',
                order: {
                    order_id: order.id,
                    track_id: Number(trackId),
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
        }

        // 3. Otherwise, perform the mock payment simulation and database insert
        const transaction_id = `TXN-${Date.now()}-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;

        const newOrderResult = await pool.query(
            `INSERT INTO orders (buyer_id, track_id, amount, status, transaction_id)
             VALUES ($1, $2, $3, 'paid', $4)
             RETURNING id, amount, status, transaction_id, created_at`,
            [buyerId, trackId, track.price, transaction_id]
        );

        const order = newOrderResult.rows[0];

        const downloadToken = Buffer.from(
            JSON.stringify({ order_id: order.id, user_id: buyerId, track_id: Number(trackId), exp: Date.now() + 15 * 60 * 1000 })
        ).toString('base64');

        return res.status(201).json({
            message: 'Payment successful. Your track is ready.',
            order: {
                order_id: order.id,
                track_id: Number(trackId),
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
        console.error('Buy Track Error:', error);
        return res.status(500).json({ message: 'Server error during checkout.' });
    }
};

const reactToTrack = async (req, res) => {
    const userId = req.user.id;
    const { id: trackId } = req.params;
    const { type } = req.body; // e.g. 'like'

    const reactionType = type || 'like';

    if (reactionType !== 'like' && reactionType !== 'comment') {
        return res.status(400).json({ message: "Invalid reaction type. Only 'like' or 'comment' are supported." });
    }

    try {
        // First check if track exists
        const trackResult = await pool.query('SELECT id FROM tracks WHERE id = $1', [trackId]);
        if (trackResult.rows.length === 0) {
            return res.status(404).json({ message: 'Track not found.' });
        }

        // Insert using ON CONFLICT DO NOTHING
        const result = await pool.query(
            `INSERT INTO interactions (user_id, track_id, type)
             VALUES ($1, $2, $3)
             ON CONFLICT (user_id, track_id, type) DO NOTHING
             RETURNING id, user_id, track_id, type, created_at`,
            [userId, trackId, reactionType]
        );

        if (result.rows.length === 0) {
            // Already reacted
            return res.status(200).json({
                message: 'skipped',
                info: 'Reaction already exists.'
            });
        }

        return res.status(201).json({
            message: 'Reaction added successfully.',
            reaction: result.rows[0]
        });
    } catch (error) {
        console.error('React To Track Error:', error);
        return res.status(500).json({ message: 'Server error while adding reaction.' });
    }
};

const getTrackReviews = async (req, res) => {
    const { id: trackId } = req.params;

    try {
        const result = await pool.query(`
            SELECT 
                r.id,
                r.track_id,
                r.rating,
                r.comment,
                r.created_at,
                u.username
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.track_id = $1
            ORDER BY r.created_at DESC
        `, [trackId]);

        return res.status(200).json({ reviews: result.rows });
    } catch (error) {
        console.error('Get Track Reviews Error:', error);
        return res.status(500).json({ message: 'Server error while fetching reviews' });
    }
};

const addTrackReview = async (req, res) => {
    const { id: trackId } = req.params;
    const userId = req.user.id;
    const username = req.user.username;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be an integer between 1 and 5.' });
    }

    if (!comment || !comment.trim()) {
        return res.status(400).json({ message: 'Comment cannot be empty.' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO reviews (track_id, user_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
            [trackId, userId, rating, comment.trim()]
        );

        const newReview = {
            ...result.rows[0],
            username: username
        };

        return res.status(201).json({
            message: 'Review added successfully',
            review: newReview
        });
    } catch (error) {
        console.error('Add Track Review Error:', error);
        return res.status(500).json({ message: 'Server error while adding review' });
    }
};

const updateTrack = async (req, res) => {
    const { id } = req.params;
    const { title, genre, price, artist } = req.body;

    try {
        const trackResult = await pool.query('SELECT title, genre, price, artist_id, artist, cover_url FROM tracks WHERE id = $1', [id]);
        if (trackResult.rows.length === 0) {
            return res.status(404).json({ message: 'Track not found.' });
        }

        if (genre !== undefined) {
            const genreCheck = await pool.query('SELECT name FROM genres WHERE LOWER(name) = LOWER($1)', [genre]);
            if (genreCheck.rows.length === 0) {
                return res.status(400).json({ message: `Genre '${genre}' is not a valid genre. Admins must create it first.` });
            }
        }

        const track = trackResult.rows[0];
        const userRole = req.user && req.user.role ? req.user.role.toLowerCase() : '';
        if (userRole !== 'admin' && track.artist_id !== req.user.id) {
            return res.status(403).json({ message: 'Access denied. You do not own this track.' });
        }

        const trackTitle = title !== undefined ? title : track.title;
        const trackGenre = genre !== undefined ? genre : track.genre;
        const trackPrice = price !== undefined ? price : track.price;
        const artistName = artist !== undefined ? artist : track.artist;

        let cover_url = track.cover_url;
        if (req.files && req.files['cover_file'] && req.files['cover_file'].length > 0) {
            const coverFile = req.files['cover_file'][0];
            cover_url = `http://localhost:5000/uploads/covers/${coverFile.filename}`;
        }

        await pool.query(
            'UPDATE tracks SET title = $1, genre = $2, price = $3, artist = $4, cover_url = $5 WHERE id = $6',
            [trackTitle, trackGenre, trackPrice, artistName, cover_url, id]
        );

        return res.status(200).json({ message: 'Track updated successfully' });
    } catch (error) {
        console.error('Update Track Error:', error);
        return res.status(500).json({ message: 'Server error while updating track' });
    }
};

const deleteTrack = async (req, res) => {
    const { id } = req.params;

    try {
        const trackResult = await pool.query('SELECT artist_id FROM tracks WHERE id = $1', [id]);
        if (trackResult.rows.length === 0) {
            return res.status(404).json({ message: 'Track not found.' });
        }

        const track = trackResult.rows[0];
        if (req.user.role !== 'admin' && track.artist_id !== req.user.id) {
            return res.status(403).json({ message: 'Access denied. You do not own this track.' });
        }

        await pool.query('DELETE FROM tracks WHERE id = $1', [id]);
        return res.status(200).json({ message: 'Track deleted successfully' });
    } catch (error) {
        console.error('Delete Track Error:', error);
        return res.status(500).json({ message: 'Server error while deleting track' });
    }
};

const getPurchasedTracks = async (req, res) => {
    const userId = req.user.id;
    try {
        const result = await pool.query(`
            SELECT 
                o.id AS order_id,
                o.amount,
                o.transaction_id,
                o.created_at AS purchased_at,
                t.id AS track_id,
                t.title,
                t.genre,
                t.file_url,
                t.cover_url,
                t.artist_id,
                t.artist
            FROM orders o
            JOIN tracks t ON o.track_id = t.id
            WHERE o.buyer_id = $1 AND o.status = 'paid'
            ORDER BY o.created_at DESC
        `, [userId]);

        return res.status(200).json({ purchases: result.rows });
    } catch (error) {
        console.error('Get Purchased Tracks Error:', error);
        return res.status(500).json({ message: 'Server error while fetching purchased tracks' });
    }
};

const getArtistSales = async (req, res) => {
    const artistId = req.user.id;
    const userRole = req.user && req.user.role ? req.user.role.toLowerCase() : '';
    if (userRole !== 'customer' && userRole !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Only customers and admins can view sales.' });
    }
    try {
        const result = await pool.query(
            `SELECT 
                o.id AS order_id,
                o.amount,
                o.transaction_id,
                o.created_at AS sold_at,
                t.title,
                t.genre,
                t.artist_id,
                t.artist,
                u.username AS buyer
             FROM orders o
             JOIN tracks t ON o.track_id = t.id
             JOIN users u ON o.buyer_id = u.id
             WHERE t.artist_id = $1 AND o.status = 'paid'
             ORDER BY o.created_at DESC`,
            [artistId]
        );
        return res.status(200).json({ sales: result.rows });
    } catch (error) {
        console.error('Get Artist Sales Error:', error);
        return res.status(500).json({ message: 'Server error while fetching sales.' });
    }
};

const getAllGenres = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name FROM genres ORDER BY name ASC');
        return res.status(200).json({ genres: result.rows });
    } catch (error) {
        console.error('Get Genres Error:', error);
        return res.status(500).json({ message: 'Server error while fetching genres' });
    }
};

const createGenre = async (req, res) => {
    const { name } = req.body;
    if (!name || !name.trim()) {
        return res.status(400).json({ message: 'Genre name is required.' });
    }

    try {
        const existing = await pool.query('SELECT id FROM genres WHERE LOWER(name) = LOWER($1)', [name.trim()]);
        if (existing.rows.length > 0) {
            return res.status(400).json({ message: 'Genre already exists.' });
        }

        const result = await pool.query(
            'INSERT INTO genres (name) VALUES ($1) RETURNING *',
            [name.trim()]
        );

        return res.status(201).json({
            message: 'Genre created successfully',
            genre: result.rows[0]
        });
    } catch (error) {
        console.error('Create Genre Error:', error);
        return res.status(500).json({ message: 'Server error while creating genre' });
    }
};

module.exports = {
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
};


