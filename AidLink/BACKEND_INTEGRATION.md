# Backend Integration Guide

This document provides detailed information about integrating the SEDS frontend with your backend API.

## Quick Start

1. **Create `.env` file** in the project root:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

2. **Update API endpoints** in `src/config/api.js` to match your backend structure

3. **Start your backend server**

4. **Start the frontend**: `npm run dev`

## API Client Architecture

### File Structure
- `src/config/api.js` - API configuration and endpoint definitions
- `src/services/apiClient.js` - HTTP client with authentication
- `src/services/dataService.js` - Business logic layer (uses apiClient)
- `src/context/AuthContext.jsx` - Authentication context (uses apiClient)

### How It Works

1. **API Client** (`apiClient.js`)
   - Handles all HTTP requests
   - Manages authentication tokens
   - Provides error handling
   - Supports timeout configuration

2. **Data Service** (`dataService.js`)
   - Business logic layer
   - Automatically falls back to mock data if API fails
   - Provides consistent response format

3. **Auth Context** (`AuthContext.jsx`)
   - Manages user authentication state
   - Handles login/logout/register
   - Stores user data and tokens

## API Endpoints

### Authentication Endpoints

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "1",
      "email": "user@example.com",
      "name": "User Name",
      "role": "donor"
    },
    "token": "jwt_token_here"
  }
}
```

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name",
  "role": "donor"
}
```

**Response:** Same as login

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "email": "user@example.com",
    "name": "User Name",
    "role": "donor"
  }
}
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer <token>
```

### Donation Requests

#### Get All Requests
```http
GET /requests
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "title": "Request Title",
      "description": "Request description",
      "amount": 1000,
      "currentAmount": 500,
      "progress": 50,
      "status": "approved",
      "verified": true,
      "donorCount": 5,
      "createdAt": "2024-01-01",
      "verifiedAt": "2024-01-02"
    }
  ]
}
```

#### Get Request by ID
```http
GET /requests/:id
Authorization: Bearer <token>
```

#### Submit Request
```http
POST /requests
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Request Title",
  "description": "Request description",
  "amount": 1000,
  "category": "medical",
  "documents": []
}
```

#### Approve Request (Admin)
```http
POST /requests/:id/approve
Authorization: Bearer <token>
Content-Type: application/json

{
  "adminNotes": "Optional admin notes"
}
```

#### Reject Request (Admin)
```http
POST /requests/:id/reject
Authorization: Bearer <token>
Content-Type: application/json

{
  "adminNotes": "Rejection reason"
}
```

#### Get Receiver Requests
```http
GET /requests/receiver
Authorization: Bearer <token>
```

### Donations

#### Create Donation
```http
POST /donations
Authorization: Bearer <token>
Content-Type: application/json

{
  "requestId": "1",
  "amount": 100,
  "anonymous": false,
  "message": "Optional message"
}
```

#### Get Donations
```http
GET /donations
Authorization: Bearer <token>
```

#### Get Donation History
```http
GET /donations/history
Authorization: Bearer <token>
```

### Admin Endpoints

#### Get Analytics
```http
GET /admin/analytics
Authorization: Bearer <token>
```

#### Get Activity Logs
```http
GET /admin/activity-logs
Authorization: Bearer <token>
```

#### Get Stats
```http
GET /admin/stats
Authorization: Bearer <token>
```

#### Get Users
```http
GET /users
Authorization: Bearer <token>
```

## Error Handling

The API client handles errors automatically:

- **401 Unauthorized**: Automatically logs out user and redirects to login
- **Network Errors**: Falls back to mock data (if available)
- **Timeout**: Shows timeout error message
- **Other Errors**: Displays error message to user

## Customization

### Changing API Base URL

Update `src/config/api.js`:
```javascript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://your-backend-url/api',
  // ...
};
```

Or set in `.env`:
```env
VITE_API_URL=http://your-backend-url/api
```

### Modifying Endpoints

Update endpoint paths in `src/config/api.js`:
```javascript
ENDPOINTS: {
  AUTH: {
    LOGIN: '/your-auth/login',
    // ...
  }
}
```

### Custom Headers

Add custom headers in `apiClient.js`:
```javascript
buildHeaders(customHeaders = {}) {
  const headers = {
    'Content-Type': 'application/json',
    'X-Custom-Header': 'value',
    ...customHeaders,
  };
  // ...
}
```

## Testing

The frontend automatically falls back to mock data if:
- Backend is not running
- API returns an error
- Network request fails

This allows you to:
- Develop frontend independently
- Test frontend without backend
- Handle backend downtime gracefully

## Troubleshooting

### API calls not working

1. Check `.env` file exists and has correct `VITE_API_URL`
2. Verify backend is running and accessible
3. Check browser console for errors
4. Verify CORS is configured on backend
5. Check network tab in browser dev tools

### Authentication issues

1. Verify token is being stored: Check `sessionStorage` in browser
2. Check token format matches backend expectations
3. Verify token expiration handling
4. Check backend token validation

### CORS Errors

Make sure your backend allows requests from frontend origin:
```javascript
// Example Express.js CORS config
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

## Support

For issues or questions:
1. Check browser console for errors
2. Review network requests in browser dev tools
3. Verify backend API responses match expected format
4. Check that endpoints match configuration in `src/config/api.js`

