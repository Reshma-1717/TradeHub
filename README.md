# TradeHub — Premium Paper Trading Platform

A full-stack MERN application for risk-free stock market simulation, built with a
**Dark Obsidian** premium theme (Royal Gold + Emerald accents).

## Tech Stack

**Frontend:** React 18, Redux Toolkit, React Router, Chart.js, Axios, React Toastify
**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs
**Security:** Helmet, express-rate-limit, CORS, password hashing

## Features

- JWT authentication with role-based access (User / Admin)
- $10,000 virtual starting balance for every new user
- 40 real US stocks pre-seeded across 9 sectors
- Live buy/sell trading with balance validation
- Portfolio tracking with real-time P&L calculation
- Watchlist management (up to 30 stocks)
- Interactive price charts (1D / 1M / 3M / 6M / 1Y)
- Admin panel: user management, stock management, platform analytics
- Fully responsive Dark Obsidian UI

## Project Structure

```
TradeHub/
├── backend/
│   ├── controllers/   # Request handlers
│   ├── middleware/    # Auth & error handling
│   ├── models/        # Mongoose schemas
│   ├── routes/        # API route definitions
│   ├── seed/          # Database seed scripts
│   └── server.js      # Entry point
└── frontend/
    └── src/
        ├── api/        # Axios instance & endpoints
        ├── components/ # Reusable UI components
        ├── pages/       # Route-level pages
        ├── redux/       # State management
        └── styles/      # Global theme CSS
```

## Setup Instructions

### Prerequisites
- Node.js v16+
- MongoDB (local install or MongoDB Atlas account)
- npm v8+

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and set your `MONGO_URI` and `JWT_SECRET`.

```bash
# Seed the database with 40 real stocks
cd seed
node stockSeed.js

# Create a default admin user
node adminSeed.js
cd ..

# Start the backend server
npm run dev
```

Backend runs on **http://localhost:5000**

### 2. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm start
```

Frontend runs on **http://localhost:3000**

## Default Login Credentials

**Admin Account** (created by adminSeed.js):
- Email: `admin@tradehub.com`
- Password: `Admin@123`

**Regular Users:** Register a new account at `/register` — you'll start with $10,000 virtual balance.

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Create account | Public |
| POST | /api/auth/login | Login | Public |
| GET  | /api/stocks | List all stocks | Public |
| GET  | /api/stocks/:symbol | Stock details | Public |
| POST | /api/trade/buy | Buy shares | User |
| POST | /api/trade/sell | Sell shares | User |
| GET  | /api/portfolio | Get portfolio | User |
| GET  | /api/watchlist | Get watchlist | User |
| POST | /api/watchlist/add | Add to watchlist | User |
| GET  | /api/admin/stats | Platform stats | Admin |
| POST | /api/stocks | Add new stock | Admin |

## Deployment

**Backend:** Render, Railway, or Heroku
**Frontend:** Vercel or Netlify
**Database:** MongoDB Atlas (free tier)

Remember to set `FRONTEND_URL` in backend `.env` for production CORS, and
`REACT_APP_API_URL` in frontend `.env` pointing to your deployed backend.

## License

Built for educational and campus project purposes.
