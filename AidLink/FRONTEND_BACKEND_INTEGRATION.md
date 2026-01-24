# Frontend-Backend Integration Guide

This guide explains how to integrate the SEDS Frontend with the Backend API.

## 🔗 Backend Repository

Backend Repository: https://github.com/HanaTeshome721/backmy.git

## 📋 Prerequisites

1. **Node.js** (v18 or higher)
2. **PostgreSQL** (v14 or higher)
3. **Git** (to clone backend if needed)

## 🚀 Setup Steps

### 1. Backend Setup

If you haven't already set up the backend:

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables
# Copy env.example.txt to .env and configure
cp env.example.txt .env

# Update .env with your database credentials:
# DATABASE_URL="postgresql://user:password@localhost:5432/seds_db?schema=public"
# JWT_SECRET="your-super-secret-jwt-key"
# JWT_REFRESH_SECRET="your-super-secret-refresh-key"
# FRONTEND_URL="http://localhost:5173"

# Run database migrations
npm run db:migrate

# Generate Prisma client
npm run db:generate

# Seed database (optional)
npm run db:seed

# Start backend server
npm run dev
```

Backend will run on: `http://localhost:3000`

### 2. Frontend Setup

```bash
# Navigate to frontend root
cd ..

# Install dependencies (if not already done)
npm install

# Create .env file for frontend
# Create .env.local or .env file with:
# VITE_API_URL=http://localhost:3000/api

# Start frontend development server
npm run dev
```

Frontend will run on: `http://localhost:5173`

## 🔧 Configuration Files

### Backend `.env` (backend/.env)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/seds_db?schema=public"

# JWT Secrets
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Server
PORT=3000
NODE_ENV=development

# CORS - Frontend URL
FRONTEND_URL=http://localhost:5173

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=jpg,jpeg,png,pdf,doc,docx

# Payment Gateways (Test Mode)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
CHAPA_SECRET_KEY=CHASECK_TEST_your_chapa_secret_key
CHAPA_PUBLIC_KEY=CHAPUBK_TEST_your_chapa_public_key

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend `.env` (root/.env or .env.local)

```env
# Backend API URL
VITE_API_URL=http://localhost:3000/api

# For production, use:
# VITE_API_URL=https://your-backend-domain.com/api
```

## 📡 API Endpoints Mapping

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Requests
- `GET /api/requests` - Get all requests (filtered by user role)
- `GET /api/requests/public` - Get public verified requests
- `GET /api/requests/receiver` - Get receiver's requests
- `GET /api/requests/:id` - Get request by ID
- `POST /api/requests` - Create new request
- `PUT /api/requests/:id` - Update request
- `DELETE /api/requests/:id` - Delete request
- `POST /api/requests/:id/submit` - Submit request for verification
- `POST /api/requests/:id/match/:offerId` - Match offer to request
- `GET /api/requests/:id/matches` - Get matching offers

### Donations
- `GET /api/donations` - Get all donations
- `GET /api/donations/history` - Get donation history
- `GET /api/donations/:id` - Get donation by ID
- `POST /api/donations` - Create donation

### Aid Coordination
- `GET /api/aid-types` - Get all aid types
- `GET /api/aid-types/:id` - Get aid type by ID
- `GET /api/aid-offers` - Get aid offers
- `GET /api/aid-offers/available` - Get available offers
- `POST /api/aid-offers` - Create aid offer
- `POST /api/aid-offers/:id/accept` - Accept offer
- `GET /api/deliveries` - Get deliveries
- `POST /api/deliveries` - Create delivery
- `POST /api/deliveries/:id/confirm` - Confirm delivery

### Admin
- `GET /api/admin/analytics` - Get analytics
- `GET /api/admin/stats` - Get dashboard stats
- `GET /api/admin/logs` - Get activity logs
- `GET /api/admin/users` - Get all users
- `POST /api/admin/requests/:id/approve` - Approve request
- `POST /api/admin/requests/:id/reject` - Reject request

### Transparency
- `GET /api/transparency/stats` - Get public stats
- `GET /api/transparency/ledger` - Get donation ledger

## 🔐 Authentication Flow

1. **Login**: User logs in → Backend returns `accessToken` and `refreshToken`
2. **Token Storage**: Frontend stores tokens in `sessionStorage` (or `localStorage`)
3. **API Requests**: Frontend includes `Authorization: Bearer <accessToken>` header
4. **Token Refresh**: When access token expires, frontend uses refresh token to get new access token
5. **Logout**: Frontend clears tokens and calls logout endpoint

## 🛠️ Frontend Integration Points

### 1. API Client (`src/services/apiClient.js`)
- Handles all HTTP requests
- Manages JWT tokens
- Handles token refresh automatically
- Base URL: `import.meta.env.VITE_API_URL || 'http://localhost:3000/api'`

### 2. API Configuration (`src/config/api.js`)
- Defines all API endpoints
- Centralized endpoint management
- Easy to update if backend routes change

### 3. Data Service (`src/services/dataService.js`)
- High-level service layer
- Provides fallback to mock data if API fails
- Used by React components

### 4. Auth Context (`src/context/AuthContext.jsx`)
- Manages authentication state
- Handles login/logout/register
- Provides user data to components

## 🧪 Testing the Integration

### 1. Test Backend Connection

```bash
# In backend directory
npm run dev
# Should see: "Server running on port 3000"
```

### 2. Test Frontend Connection

```bash
# In frontend root
npm run dev
# Should see: "Local: http://localhost:5173"
```

### 3. Test API Call

Open browser console and check:
- Network tab should show requests to `http://localhost:3000/api`
- No CORS errors
- Responses should be JSON with `success: true`

### 4. Test Authentication

1. Register a new user
2. Login with credentials
3. Check that tokens are stored
4. Make authenticated API call
5. Verify user data is displayed

## 🐛 Troubleshooting

### CORS Errors
- **Problem**: Frontend can't access backend
- **Solution**: Check `FRONTEND_URL` in backend `.env` matches frontend URL

### 401 Unauthorized
- **Problem**: Token expired or invalid
- **Solution**: Check token storage, try logging in again

### 404 Not Found
- **Problem**: Endpoint doesn't exist
- **Solution**: Check backend routes match frontend API config

### Database Connection Error
- **Problem**: Can't connect to PostgreSQL
- **Solution**: Check `DATABASE_URL` in backend `.env`, ensure PostgreSQL is running

### Port Already in Use
- **Problem**: Port 3000 or 5173 already in use
- **Solution**: Change port in `.env` or kill process using the port

## 📦 Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use production database URL
3. Set secure JWT secrets
4. Configure CORS for production frontend URL
5. Set up SSL/HTTPS

### Frontend
1. Set `VITE_API_URL` to production backend URL
2. Build: `npm run build`
3. Deploy `dist` folder to hosting service

## 🔄 Updating from Backend Repository

If backend repository is updated:

```bash
# In backend directory
git pull origin main
npm install  # Install new dependencies
npm run db:migrate  # Run new migrations
npm run db:generate  # Regenerate Prisma client
```

## 📝 Notes

- Backend runs on port 3000 by default
- Frontend runs on port 5173 by default (Vite)
- API base path is `/api`
- All endpoints return JSON with `success` boolean
- Error responses include `error` or `message` field

## ✅ Integration Checklist

- [ ] Backend server running on port 3000
- [ ] Frontend server running on port 5173
- [ ] Database connected and migrated
- [ ] Environment variables configured
- [ ] CORS configured correctly
- [ ] Authentication working
- [ ] API calls successful
- [ ] No console errors
- [ ] Tokens stored correctly
- [ ] Token refresh working

