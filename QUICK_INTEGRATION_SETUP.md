# Quick Integration Setup Guide

## 🚀 Fast Setup (5 minutes)

### Step 1: Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file (copy from env.example.txt)
# Windows PowerShell:
Copy-Item env.example.txt .env

# Edit .env and set:
# DATABASE_URL="postgresql://user:password@localhost:5432/seds_db?schema=public"
# JWT_SECRET="your-secret-key-here"
# JWT_REFRESH_SECRET="your-refresh-secret-here"
# FRONTEND_URL="http://localhost:5173"

# Run migrations
npm run db:migrate

# Generate Prisma client
npm run db:generate

# Start backend (runs on port 3000)
npm run dev
```

### Step 2: Frontend Setup

```bash
# In project root (not backend folder)
# Create .env.local file
# Windows PowerShell:
echo "VITE_API_URL=http://localhost:3000/api" > .env.local

# Install dependencies (if not done)
npm install

# Start frontend (runs on port 5173)
npm run dev
```

### Step 3: Verify Connection

1. Open browser: `http://localhost:5173`
2. Open browser console (F12)
3. Try to register/login
4. Check Network tab - should see requests to `http://localhost:3000/api`
5. No CORS errors = Success! ✅

## 🔧 Environment Variables

### Backend `.env` (backend/.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/seds_db?schema=public"
JWT_SECRET="change-this-in-production"
JWT_REFRESH_SECRET="change-this-in-production"
FRONTEND_URL="http://localhost:5173"
PORT=3000
```

### Frontend `.env.local` (root/.env.local)
```env
VITE_API_URL=http://localhost:3000/api
```

## ✅ Integration Checklist

- [ ] Backend running on port 3000
- [ ] Frontend running on port 5173
- [ ] Database connected
- [ ] No CORS errors in console
- [ ] Can register new user
- [ ] Can login
- [ ] API calls working

## 🐛 Common Issues

**CORS Error?**
- Check `FRONTEND_URL` in backend `.env` matches frontend URL (http://localhost:5173)

**401 Unauthorized?**
- Check tokens are being stored (check browser DevTools > Application > Storage)
- Try logging in again

**Database Error?**
- Check PostgreSQL is running
- Check `DATABASE_URL` in backend `.env` is correct
- Run `npm run db:migrate` again

**Port Already in Use?**
- Change `PORT` in backend `.env`
- Or kill process: `netstat -ano | findstr :3000` then `taskkill /PID <pid> /F`

## 📚 Full Documentation

See `FRONTEND_BACKEND_INTEGRATION.md` for detailed documentation.

