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
                t.created_at,
                u.username AS artist
            FROM tracks t
            JOIN users u ON t.artist_id = u.id
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
    const { title, genre, price, file_url } = req.body;

    if (req.user.role !== 'artist') {
        return res.status(403).json({ message: 'Access denied. Only artists can upload tracks.' });
    }

    if (!title || !genre || price === undefined || !file_url) {
        return res.status(400).json({ message: 'All track fields are required (title, genre, price, file_url).' });
    }

    try {
        // Pre-check if a track with the same title exists for this artist
        const existing = await pool.query(
            'SELECT id, title, genre, price, file_url, artist_id FROM tracks WHERE artist_id = $1 AND title = $2',
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
            'INSERT INTO tracks (title, genre, price, file_url, artist_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, genre, price, file_url, artistId]
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

module.exports = {
    getAllTracks,
    uploadTrack,
    streamTrack,
    buyTrack,
    reactToTrack
};

