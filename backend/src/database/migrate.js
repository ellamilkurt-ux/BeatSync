const pool = require('./db');

async function migrate() {
    console.log("Starting database migration...");
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS reviews (
                id SERIAL PRIMARY KEY,
                track_id INTEGER NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
                comment TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Table 'reviews' successfully verified/created.");

        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_reviews_track_id ON reviews(track_id);
        `);
        console.log("Index 'idx_reviews_track_id' successfully verified/created.");
        
        // Create genres table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS genres (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) UNIQUE NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Table 'genres' successfully verified/created.");

        // Seed default genres if none exist
        const defaultGenres = ['Hip-Hop', 'R&B', 'House', 'Pop', 'EDM', 'Ambient', 'Phonk'];
        for (const genre of defaultGenres) {
            await pool.query(
                'INSERT INTO genres (name) VALUES ($1) ON CONFLICT (name) DO NOTHING',
                [genre]
            );
        }
        console.log("Default genres seeded/verified.");

        console.log("Migration completed successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

migrate();
