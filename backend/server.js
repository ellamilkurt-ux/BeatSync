require('dotenv').config();
const pool = require('./src/database/db');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const authRouter = require('./src/routes/authRoute');
const trackRouter = require('./src/routes/trackRoute');
const marketplaceRouter = require('./src/routes/marketplaceRoute');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const allowedOrigins = ['http://localhost:5173'];
app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/tracks', trackRouter);
app.use('/api/marketplace', marketplaceRouter);

app.get('/', async (req, res) =>{
    try {
        const result = await pool.query("SELECT current_database()");
        res.send(`The database name is ${result.rows[0].current_database}`);
    } catch (error) {
        console.error("Database connection error:", error.message);
        res.status(500).json({ error: "Database connection failed" });
    }
});

app.use((err, req, res, next) => {
    res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
