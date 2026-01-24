# 🔍 Registration Debugging Guide

## Common Issues & Solutions

### Issue 1: Backend Not Running
**Symptoms**: Registration fails silently or shows network error

**Solution**:
1. Check if backend is running:
   ```bash
   cd backend
   npm run dev
   ```
2. Verify backend is on port 3000:
   - Check `backend/.env` for `PORT=3000`
   - Or check console for "Server running on port 3000"

### Issue 2: API URL Mismatch
**Symptoms**: CORS errors or "Network Error"

**Solution**:
1. Check `src/config/api.js`:
   ```javascript
   BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
   ```
2. Create `.env` file in frontend root:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

### Issue 3: Validation Errors
**Symptoms**: Form doesn't submit, no error shown

**Check**:
1. All required fields filled:
   - Name ✓
   - Email ✓
   - Password ✓
   - Confirm Password ✓
   - Role selected ✓
   - Terms accepted ✓

2. Password requirements:
   - Minimum 6 characters
   - Passwords match

3. Email format:
   - Valid email format (e.g., user@example.com)

### Issue 4: Role Mapping Issue
**Symptoms**: Registration succeeds but wrong role assigned

**Check**:
- Frontend sends: `aid_seeker`, `aid_provider`, `organization`
- Backend expects: `AID_SEEKER`, `AID_PROVIDER`, `ORGANIZATION`
- Backend converts to uppercase automatically ✓

### Issue 5: Database Connection
**Symptoms**: "Database error" or "Prisma error"

**Solution**:
1. Check database is running
2. Check `.env` in backend:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/seds_db"
   ```
3. Run migrations:
   ```bash
   cd backend
   npx prisma migrate dev
   ```

### Issue 6: User Already Exists
**Symptoms**: "User with this email already exists"

**Solution**:
- Try different email
- Or delete existing user from database

## Debugging Steps

### Step 1: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for errors (red text)
4. Check Network tab for failed requests

### Step 2: Check Network Requests
1. Open DevTools → Network tab
2. Try to register
3. Look for `/api/auth/register` request
4. Check:
   - Status code (should be 201)
   - Request payload (all fields present)
   - Response (success: true)

### Step 3: Check Backend Logs
1. Look at backend console
2. Check for:
   - "User registered successfully"
   - Any error messages
   - Database connection errors

### Step 4: Test API Directly
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "name": "Test User",
    "role": "AID_SEEKER"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "user": { ... },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

## Quick Fixes

### Fix 1: Clear Browser Cache
- Clear localStorage and sessionStorage
- Hard refresh (Ctrl+Shift+R)

### Fix 2: Restart Both Servers
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
npm run dev
```

### Fix 3: Check Form Validation
Add console.log to see what's being sent:
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  console.log('Form Data:', formData);
  console.log('Errors:', errors);
  // ... rest of code
};
```

## Most Common Issue

**90% of registration failures are due to:**
1. Backend not running
2. Wrong API URL
3. Database not connected
4. Missing required fields

Check these first!

