# SEDS Quick Start Guide

Get your production-grade donation platform running in minutes!

## 🚀 Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ installed and running
- npm or yarn

## ⚡ Quick Setup (5 minutes)

### 1. Clone & Install

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Setup Database

```bash
# Create PostgreSQL database
createdb seds_db

# Or using psql:
psql -U postgres
CREATE DATABASE seds_db;
\q
```

### 3. Configure Backend

```bash
cd backend

# Copy environment template
cp .env.example .env

# Edit .env and set:
# - DATABASE_URL="postgresql://user:password@localhost:5432/seds_db"
# - JWT_SECRET="your-random-secret-here"
# - JWT_REFRESH_SECRET="your-random-refresh-secret-here"
```

**Generate secrets:**
```bash
# On Linux/Mac:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use: openssl rand -hex 32
```

### 4. Setup Database Schema

```bash
cd backend

# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed test data
npm run db:seed
```

### 5. Configure Frontend

```bash
# In project root, create .env file
echo "VITE_API_URL=http://localhost:3000/api" > .env
```

### 6. Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 7. Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/health

## 🔐 Test Accounts

After seeding, use these accounts:

- **Admin**: admin@seds.com / admin123
- **Donor**: donor@seds.com / donor123
- **Receiver**: receiver@seds.com / receiver123

## ✅ Verify Installation

1. **Backend Health:**
   ```bash
   curl http://localhost:3000/health
   ```
   Should return: `{"status":"ok",...}`

2. **Frontend:**
   - Open http://localhost:5173
   - Should see landing page
   - Click "Transparency" to see public page

3. **Login:**
   - Go to /login
   - Login with test account
   - Should redirect to dashboard

## 🎯 Next Steps

### Test Payment Flow (Stripe Test Mode)

1. **Get Stripe Test Keys:**
   - Sign up at https://stripe.com
   - Get test keys from Dashboard

2. **Configure Backend:**
   ```bash
   # In backend/.env
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

3. **Install Stripe.js in Frontend:**
   ```bash
   npm install @stripe/stripe-js
   ```

4. **Test Flow:**
   - Login as donor
   - Browse requests
   - Make donation
   - Complete payment (use test card: 4242 4242 4242 4242)

### Explore Features

- **Transparency Page**: `/transparency` (public, no login)
- **Admin Dashboard**: Login as admin
- **Create Request**: Login as receiver
- **Make Donation**: Login as donor

## 🐛 Troubleshooting

### Database Connection Failed

```bash
# Check PostgreSQL is running
pg_isready

# Check connection string in backend/.env
# Format: postgresql://username:password@localhost:5432/database_name
```

### Port Already in Use

```bash
# Change port in backend/.env
PORT=3001

# Or kill process using port 3000
# Linux/Mac:
lsof -ti:3000 | xargs kill

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Prisma Errors

```bash
cd backend

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Or regenerate client
npm run db:generate
```

### CORS Errors

- Check `FRONTEND_URL` in `backend/.env`
- Should match your frontend URL (http://localhost:5173)
- Restart backend after changing

## 📚 Documentation

- [Backend README](./backend/README.md) - Backend API documentation
- [Production Upgrade Guide](./PRODUCTION_UPGRADE.md) - Complete upgrade details
- [Backend Integration](./BACKEND_INTEGRATION.md) - Frontend-backend integration

## 🎓 For Academic Projects

This setup demonstrates:
- ✅ Full-stack development
- ✅ Database design
- ✅ API architecture
- ✅ Authentication & security
- ✅ Payment integration
- ✅ Production practices

Perfect for final-year projects and portfolios!

## 🚀 Ready for Production?

See [PRODUCTION_UPGRADE.md](./PRODUCTION_UPGRADE.md) for deployment steps.

---

**Need Help?** Check the documentation files or review error messages in console.

