# BeatSync

A full-stack music marketplace platform that connects artists with music enthusiasts. BeatSync enables users to browse, purchase, and stream high-quality beats while providing artists with tools to upload, manage, and monetize their music.

## Features

- 🎵 **Music Marketplace** - Browse and purchase beats from independent artists
- 🛒 **Shopping Cart & Wishlist** - Save tracks for later or add to cart for checkout
- ⭐ **Reviews & Ratings** - Community-driven feedback system with ratings and detailed reviews
- 👤 **Role-Based Access** - Three user roles (User, Artist, Admin) with distinct permissions
- 🎧 **Audio Streaming** - Stream and download purchased tracks
- 📊 **Artist Dashboard** - Track sales metrics and manage your music catalog
- 🔐 **Secure Authentication** - JWT-based authentication with HTTP-only cookies and password hashing

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - REST API framework
- **PostgreSQL** (via Supabase) - Cloud database for user data, tracks, orders, and interactions

### Frontend
- **React** - UI library with Vite bundler
- **Vite** - Fast build tool and dev server
- **CSS** - Responsive styling

### Database
- **Supabase** - Managed PostgreSQL cloud database with built-in authentication support and real-time capabilities

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with your Supabase connection details:
   ```
   DATABASE_URL=your_supabase_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

4. Run database migrations:
   ```bash
   npm run migrate
   ```

5. Start the development server:
   ```bash
   npm start
   ```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your backend API URL:
   ```
   VITE_API_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173`

## Database

BeatSync uses **Supabase**, a managed PostgreSQL cloud database service. The database includes the following main tables:

- **users** - User accounts with roles (user, artist, admin), credentials, and credit balance
- **tracks** - Music tracks with metadata, pricing, and artist information
- **orders** - Purchase transactions and payment records
- **interactions** - User actions including cart items, wishlist entries, and reactions
- **reviews** - Track reviews with ratings and comments

## Advanced Features

### 🔒 Transaction-Based Cart Checkout
The payment processing system implements database transactions with row-level locking to ensure data integrity. When a user checks out:
- Track rows are locked to prevent race conditions
- Multiple purchases are atomic operations - either all succeed or all rollback
- Cart items are automatically removed upon successful payment
- This ensures accurate inventory and prevents double-purchases or lost transactions

### Key Implementation Details:
- **Atomic Transactions** - All cart items processed within a single transaction block
- **Database Locks** - Prevents concurrent modifications during checkout
- **Automatic Cleanup** - Cart entries removed on successful payment
- **Error Handling** - Full rollback if any purchase fails
- **Secure Download Tokens** - Generated after successful payment for track access

## Project Structure

```
BeatSync/
├── backend/
│   ├── src/
│   │   ├── controller/     # Business logic for auth, tracks, and marketplace
│   │   ├── routes/         # API endpoint definitions
│   │   ├── middleware/     # Authentication and authorization middleware
│   │   └── database/       # Database connection and migrations
│   ├── uploads/            # User-uploaded files (covers and music)
│   └── server.js           # Express server entry point
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── assets/         # Static assets and images
│   │   └── App.jsx         # Main app component
│   └── vite.config.js      # Vite configuration
└── README.md               # This file
```

## API Overview

### Authentication
- `POST /auth/register` - Create new user account
- `POST /auth/login` - Authenticate user
- `GET /auth/profile` - Get current user profile
- `POST /auth/logout` - Sign out user

### Tracks
- `GET /tracks` - Browse all available tracks
- `POST /tracks/upload` - Upload a new track (artists only)
- `GET /tracks/:id` - Get track details
- `PUT /tracks/:id` - Update track (admin or owner)
- `DELETE /tracks/:id` - Delete track (admin or owner)

### Marketplace
- `POST /marketplace/cart` - Add to cart
- `GET /marketplace/cart` - Get cart items
- `DELETE /marketplace/cart/:id` - Remove from cart
- `POST /marketplace/checkout` - Process payment
- `POST /marketplace/wishlist` - Add to wishlist
- `GET /marketplace/wishlist` - Get wishlist items

## Contributing

This is a portfolio project. Feel free to fork and customize!

## License

See the LICENSE file for details.
