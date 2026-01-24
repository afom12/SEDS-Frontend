# 🚀 Setup Instructions - Frontend & Backend Integration

## Quick Start (5 minutes)

### Step 1: Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file from example
# Windows PowerShell:
Copy-Item env.example.txt .env

# Edit .env file and update:
# - DATABASE_URL (your PostgreSQL connection string)
# - JWT_SECRET (generate a random string)
# - JWT_REFRESH_SECRET (generate another random string)
# - FRONTEND_URL=http://localhost:5173

# Run database migrations
npm run db:migrate

# Generate Prisma client
npm run db:generate

# Start backend server (runs on port 3000)
npm run dev
```

**Backend should now be running on:** `http://localhost:3000`

### Step 2: Frontend Setup

```bash
# In project root (not backend folder)
# Create .env.local file
# Windows PowerShell:
echo "VITE_API_URL=http://localhost:3000/api" > .env.local

# Or manually create .env.local with:
# VITE_API_URL=http://localhost:3000/api

# Install dependencies (if not already done)
npm install

# Start frontend development server (runs on port 5173)
npm run dev
```

**Frontend should now be running on:** `http://localhost:5173`

### Step 3: Verify Integration

1. Open browser: `http://localhost:5173`
2. Open Developer Tools (F12)
3. Go to Network tab
4. Try to register a new user or login
5. Check that requests are going to `http://localhost:3000/api`
6. No CORS errors = Success! ✅

## 🔧 Environment Variables

### Backend `.env` (backend/.env)

```env
# Database Connection
DATABASE_URL="postgresql://username:password@localhost:5432/seds_db?schema=public"

# JWT Secrets (generate random strings)
JWT_SECRET="your-random-secret-key-here-min-32-chars"
JWT_REFRESH_SECRET="your-random-refresh-secret-here-min-32-chars"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS - Frontend URL
FRONTEND_URL=http://localhost:5173

# File Upload Settings
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=jpg,jpeg,png,pdf,doc,docx

# Payment Gateways (Test Mode - Optional)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
CHAPA_SECRET_KEY=CHASECK_TEST_your_chapa_secret_key
CHAPA_PUBLIC_KEY=CHAPUBK_TEST_your_chapa_public_key

# Security Settings
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend `.env.local` (root/.env.local)

```env
# Backend API URL
VITE_API_URL=http://localhost:3000/api

# For production, change to:
# VITE_API_URL=https://your-backend-domain.com/api
```

## 📋 Prerequisites

- **Node.js** v18 or higher
- **PostgreSQL** v14 or higher
- **Git** (for cloning if needed)

## 🐛 Troubleshooting

### CORS Errors
**Problem:** Browser console shows CORS errors  
**Solution:** 
- Check `FRONTEND_URL` in backend `.env` matches frontend URL (`http://localhost:5173`)
- Restart backend server after changing `.env`

### 401 Unauthorized
**Problem:** Getting 401 errors on API calls  
**Solution:**
- Check tokens are stored (DevTools > Application > Storage)
- Try logging in again
- Check backend JWT secrets are set correctly

### Database Connection Error
**Problem:** Backend can't connect to database  
**Solution:**
- Check PostgreSQL is running
- Verify `DATABASE_URL` in backend `.env` is correct
- Test connection: `psql -U username -d seds_db`

### Port Already in Use
**Problem:** Port 3000 or 5173 already in use  
**Solution:**
- Change `PORT` in backend `.env`
- Or kill process: `netstat -ano | findstr :3000` then `taskkill /PID <pid> /F`

### Module Not Found Errors
**Problem:** Backend shows module errors  
**Solution:**
- Run `npm install` in backend folder
- Run `npm run db:generate` to regenerate Prisma client

## ✅ Verification Checklist

- [ ] Backend running on port 3000
- [ ] Frontend running on port 5173
- [ ] Database connected (check backend console)
- [ ] No CORS errors in browser console
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Tokens stored in browser storage
- [ ] API calls successful (check Network tab)
- [ ] User data displayed correctly

## 📚 Additional Documentation

- **Full Integration Guide**: See `FRONTEND_BACKEND_INTEGRATION.md`
- **Quick Setup**: See `QUICK_INTEGRATION_SETUP.md`
- **Backend README**: See `backend/README.md`

## 🎯 Next Steps After Setup

1. **Test Authentication**
   - Register a new user
   - Login
   - Check token storage
   - Test logout

2. **Test API Endpoints**
   - Create a request
   - View requests
   - Make a donation
   - Check admin dashboard

3. **Test Aid Coordination** (if implemented)
   - Create aid request
   - Create aid offer
   - Match offers to requests
   - Track deliveries

## 💡 Tips

- Keep both servers running during development
- Check browser console for errors
- Check backend console for API logs
- Use Network tab to debug API calls
- Clear browser cache if seeing old data

---

**Ready to start?** Follow the Quick Start steps above! 🚀

