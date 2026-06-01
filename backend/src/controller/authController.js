const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../database/db');

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000
};

const generateToken = (id, username, role) => {
    return jwt.sign({ id, username, role }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

const userRegister = async (req, res) => {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'provide all the details that are required' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    try {
        const emailLower = email.toLowerCase().trim();
        const userExist = await pool.query('SELECT * FROM users WHERE LOWER(email) = $1', [emailLower]);

        if (userExist.rows.length > 0) {
            return res.status(400).json({ message: 'This user exist already' });
        }

        const allowedRoles = ['viewer', 'artist', 'admin'];
        const userRole = role ? role.toLowerCase().trim() : 'viewer';
        if (!allowedRoles.includes(userRole)) {
            return res.status(400).json({ message: 'Invalid role selection.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await pool.query(
            'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *',
            [username, emailLower, hashedPassword, userRole]
        );

        const token = generateToken(newUser.rows[0].id, newUser.rows[0].username, newUser.rows[0].role);

        res.cookie('token', token, cookieOptions);

        const user = { ...newUser.rows[0] };
        delete user.password_hash;

        return res.status(201).json({ user, token });
    } catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({ message: "Server error during registration" });
    }
};

const userLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Provide all required fields' });
    }

    try {
        const emailLower = email.toLowerCase().trim();
        const user = await pool.query('SELECT * FROM users WHERE LOWER(email) = $1', [emailLower]);

        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const userData = user.rows[0];

        const isMatch = await bcrypt.compare(password, userData.password_hash);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const token = generateToken(userData.id, userData.username, userData.role);

        res.cookie('token', token, cookieOptions);

        res.json({
            token: token,
            user: { id: userData.id, username: userData.username, email: userData.email, role: userData.role }
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Server error during login" });
    }
};

const userProfile = async (req, res) => {
    res.json(req.user);
};

const userLogout = async (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    });
    res.status(200).json({ message: "Logged out successfully" });
};

const updateProfile = async (req, res) => {
    const { username, email } = req.body;

    if (!username || !email || !username.trim() || !email.trim()) {
        return res.status(400).json({ message: "Username and email cannot be empty." });
    }

    try {
        await pool.query('UPDATE users SET username = $1, email = $2 WHERE id = $3', [username, email, req.user.id]);
        res.status(200).json({ message: "Profile updated" });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({ message: "Username or email is already taken." });
        }
        res.status(500).json({ message: "Server error" });
    }
};

const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ message: "New password must be at least 6 characters long." });
    }

    try {
        const user = await pool.query('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);
        const isMatch = await bcrypt.compare(currentPassword, user.rows[0].password_hash);
        if (!isMatch) return res.status(400).json({ message: "Incorrect current password" });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hashedPassword, req.user.id]);
        res.status(200).json({ message: "Password updated" });
    } catch (error) { res.status(500).json({ message: "Server error" }); }
};

const MAX_CREDIT_TOPUP = 1000;

const addCredits = async (req, res) => {
    const { amount } = req.body;
    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ message: "Amount must be a positive number" });
    }
    if (amount > MAX_CREDIT_TOPUP) {
        return res.status(400).json({ message: `Maximum top-up amount is ${MAX_CREDIT_TOPUP} credits` });
    }
    try {
        await pool.query('UPDATE users SET credits = credits + $1 WHERE id = $2', [amount, req.user.id]);
        res.status(200).json({ message: "Credits added" });
    } catch (error) { res.status(500).json({ message: "Server error" }); }
};

const FORGOT_PASSWORD_WINDOW_MS = 15 * 60 * 1000;
const MAX_FORGOT_ATTEMPTS = 5;
const forgotPasswordAttempts = new Map();

const forgotPassword = async (req, res) => {
    const { email, username, newPassword } = req.body;
    if (!email || !username || !newPassword) {
        return res.status(400).json({ message: 'Provide email, username, and new password' });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ message: "New password must be at least 6 characters long." });
    }

    const clientIP = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const attempts = forgotPasswordAttempts.get(clientIP) || [];
    const recentAttempts = attempts.filter(ts => now - ts < FORGOT_PASSWORD_WINDOW_MS);

    if (recentAttempts.length >= MAX_FORGOT_ATTEMPTS) {
        return res.status(429).json({ message: 'Too many password reset attempts. Please try again later.' });
    }

    recentAttempts.push(now);
    forgotPasswordAttempts.set(clientIP, recentAttempts);

    try {
        const emailLower = email.toLowerCase().trim();
        const usernameLower = username.toLowerCase().trim();

        const user = await pool.query(
            'SELECT * FROM users WHERE LOWER(email) = $1 AND LOWER(username) = $2',
            [emailLower, usernameLower]
        );

        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid email or username combination' });
        }

        const userId = user.rows[0].id;
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hashedPassword, userId]);

        return res.status(200).json({ message: 'Password reset successful. Please sign in.' });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        return res.status(500).json({ message: "Server error during password reset" });
    }
};

module.exports = { userRegister, userLogin, userProfile, userLogout, updateProfile, changePassword, addCredits, forgotPassword };
