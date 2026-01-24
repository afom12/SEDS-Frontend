# Backend Integration Guide

This document explains how the frontend has been integrated with the backend API from [https://github.com/afom12/backmy.git](https://github.com/afom12/backmy.git).

## Changes Made

### 1. API Configuration (`src/config/api.js`)
- Updated `BASE_URL` to use `/api/v1` prefix: `http://localhost:3000/api/v1`
- Updated all endpoints to match backend routes:
  - Auth: `/api/v1/auth/*`
  - Items: `/api/v1/items/*` (maps to donations)
  - Requests: `/api/v1/requests/*`
  - Categories: `/api/v1/categories/*`
  - Complaints: `/api/v1/complaints/*`
  - Notifications: `/api/v1/notifications/*`
  - Admin Users: `/api/v1/admin/users/*`
  - Reports: `/api/v1/reports/*`

### 2. API Client (`src/services/apiClient.js`)
- Updated refresh token endpoint to `/auth/refresh-token` (matches backend)

### 3. Authentication Context (`src/context/AuthContext.jsx`)
- Updated register function to send `username` instead of `name` (backend requirement)
- Added `fullName` field for user's display name
- Maintained backward compatibility with mock data fallback

### 4. Backend CORS Configuration (`backend/src/app.js`)
- Updated CORS to allow requests from Vite dev server (`http://localhost:5173`)
- Default CORS origins now include both port 5173 and 3000

### 5. Backend Setup Documentation (`backend/SETUP.md`)
- Created setup guide with environment variables
- Documented API endpoints
- Added installation instructions

## Backend API Structure

### Authentication Endpoints
- `POST /api/v1/auth/register` - Register new user
  - Body: `{ email, username, password, role?, fullName? }`
  - Response: `{ success, data: { user, accessToken, refreshToken }, message }`
  
- `POST /api/v1/auth/login` - Login user
  - Body: `{ email, password }`
  - Response: `{ success, data: { user, accessToken, refreshToken }, message }`
  
- `GET /api/v1/auth/me` - Get current user
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ success, data: { user }, message }`
  
- `POST /api/v1/auth/logout` - Logout user
  - Headers: `Authorization: Bearer <token>`
  
- `POST /api/v1/auth/refresh-token` - Refresh access token
  - Body: `{ refreshToken }`
  - Response: `{ success, data: { accessToken }, message }`

### User Roles
- `admin` - Administrator
- `donor` - Donor (default)
- `recipient` - Recipient/Receiver

### Other Endpoints
- Items: `/api/v1/items/*` - Manage donation items
- Requests: `/api/v1/requests/*` - Manage donation requests
- Categories: `/api/v1/categories/*` - Manage categories
- Complaints: `/api/v1/complaints/*` - Manage complaints
- Notifications: `/api/v1/notifications/*` - Manage notifications
- Admin Users: `/api/v1/admin/users/*` - Admin user management
- Reports: `/api/v1/reports/*` - Reports

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (see `backend/SETUP.md` for template):
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/backmy
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRY=7d
JWT_REFRESH_EXPIRY=30d
# ... other variables
```

4. Start MongoDB (if not running)

5. Start backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:3000`

### Frontend Setup

1. Install dependencies (if not already done):
```bash
npm install
```

2. Create `.env` file (optional, defaults work for development):
```env
VITE_API_URL=http://localhost:3000/api/v1
```

3. Start frontend dev server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## Testing the Integration

1. Start both backend and frontend servers
2. Open `http://localhost:5173` in your browser
3. Try registering a new user
4. Try logging in with registered credentials
5. Verify API calls are being made to the backend (check browser Network tab)

## Response Format

The backend uses a consistent response format:

**Success Response:**
```json
{
  "statusCode": 200,
  "data": { ... },
  "message": "Success message",
  "success": true
}
```

**Error Response:**
```json
{
  "statusCode": 400,
  "data": null,
  "message": "Error message",
  "success": false,
  "errors": []
}
```

The frontend API client handles these responses automatically.

## Notes

- The frontend maintains backward compatibility with mock data if the backend is unavailable
- Token refresh is handled automatically by the API client
- CORS is configured to allow requests from the Vite dev server
- All API endpoints use the `/api/v1` prefix


