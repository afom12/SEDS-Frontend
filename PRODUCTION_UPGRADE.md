# SEDS Production Upgrade Guide

This document outlines the comprehensive upgrade from an academic demo to a production-grade donation platform.

## 🎯 Upgrade Overview

The SEDS platform has been upgraded from a frontend-only demo to a full-stack, production-ready donation platform with:

1. **Real Backend Architecture** - Node.js + Express + PostgreSQL + Prisma
2. **Payment Integration** - Stripe (test mode) + Chapa (Ethiopia)
3. **Verification System** - Document uploads, admin verification workflow
4. **Transparency Features** - Public ledger, audit logs, impact reports
5. **Production Security** - JWT auth, rate limiting, input validation
6. **Deployment Ready** - Environment configs, documentation

## 📁 Project Structure

```
SEDS_Frontend/
├── backend/                 # Backend API (NEW)
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Auth, error handling
│   ├── routes/            # API routes
│   ├── utils/             # Utilities (JWT, validation)
│   ├── prisma/            # Database schema & migrations
│   ├── server.js          # Express server
│   └── package.json
├── src/                    # Frontend (EXISTING)
│   ├── components/        # UI components
│   ├── pages/             # Page components
│   ├── services/          # API client
│   └── config/            # API configuration
└── README.md
```

## 🚀 Quick Start

### Backend Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Setup PostgreSQL database:**
   ```bash
   # Create database
   createdb seds_db
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL and secrets
   ```

4. **Run migrations:**
   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

5. **Start backend:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Configure API URL:**
   ```bash
   # Create .env file in root
   echo "VITE_API_URL=http://localhost:3000/api" > .env
   ```

2. **Start frontend:**
   ```bash
   npm run dev
   ```

## 🔐 Authentication Flow

### JWT Token System

- **Access Token**: Short-lived (15 minutes), used for API requests
- **Refresh Token**: Long-lived (7 days), used to get new access tokens

### Implementation

1. User logs in → Receives both tokens
2. Frontend stores tokens in sessionStorage
3. Access token sent in `Authorization: Bearer <token>` header
4. On 401 error → Use refresh token to get new access token
5. On refresh failure → Redirect to login

## 💳 Payment Integration

### Stripe (Test Mode)

1. **Get test keys** from Stripe Dashboard
2. **Configure in backend `.env`:**
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

3. **Frontend integration:**
   - Install Stripe.js: `npm install @stripe/stripe-js`
   - Create payment intent via API
   - Use Stripe Elements for card input
   - Confirm payment on frontend
   - Backend webhook handles completion

### Chapa (Ethiopia)

Chapa integration placeholder - implement based on Chapa API docs.

## ✅ Verification System

### Request Status Lifecycle

```
DRAFT → SUBMITTED → VERIFIED → FUNDED → COMPLETED
                ↓
            REJECTED
```

### Document Upload

- Receivers can upload verification documents
- Admin reviews documents before approval
- Documents stored securely with file validation

### Admin Verification

- Admin reviews submitted requests
- Can approve or reject with notes
- All actions logged in audit trail

## 🔍 Transparency Features

### Public Ledger

- `/transparency/ledger` - Shows all completed donations
- Anonymous donations shown as "Anonymous"
- Includes receipt numbers for verification

### Public Request Pages

- `/transparency/requests/:id` - Public view of verified requests
- Shows progress, impact reports, donation count
- No login required

### Audit Logs

- All admin actions logged immutably
- Includes IP address, user agent, timestamp
- Accessible only to admins

## 🛡️ Security Features

### Implemented

- ✅ JWT authentication with refresh tokens
- ✅ Role-based authorization middleware
- ✅ Rate limiting (100 req/15min)
- ✅ Input validation (express-validator)
- ✅ Password hashing (bcrypt, 12 rounds)
- ✅ SQL injection protection (Prisma ORM)
- ✅ CORS configuration
- ✅ Helmet security headers
- ✅ File upload validation

### Production Checklist

- [ ] Change all default secrets
- [ ] Use strong JWT secrets (32+ chars)
- [ ] Enable HTTPS
- [ ] Configure production CORS
- [ ] Set up database backups
- [ ] Enable monitoring/logging
- [ ] Review file upload limits
- [ ] Configure webhook secrets
- [ ] Set up rate limiting per endpoint
- [ ] Enable request logging

## 📊 Database Schema

### Key Models

- **User**: Authentication, roles, verification
- **Request**: Donation requests with status tracking
- **Donation**: Individual donations linked to requests
- **Transaction**: Payment gateway transactions
- **Document**: Verification documents
- **ImpactReport**: Impact reports with photos
- **AdminLog**: Immutable audit trail

See `backend/prisma/schema.prisma` for full schema.

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user

### Requests
- `GET /api/requests` - Get all requests (with filters)
- `GET /api/requests/public` - Public verified requests
- `POST /api/requests` - Create request (RECEIVER)
- `POST /api/requests/:id/submit` - Submit for verification

### Donations
- `POST /api/donations` - Create donation (DONOR)
- `GET /api/donations/history` - Get donation history

### Payments
- `POST /api/payments/intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment

### Admin
- `POST /api/admin/requests/:id/approve` - Approve request
- `POST /api/admin/requests/:id/reject` - Reject request
- `GET /api/admin/analytics` - Get analytics
- `GET /api/admin/logs` - Get activity logs

### Transparency
- `GET /api/transparency/ledger` - Public donation ledger
- `GET /api/transparency/stats` - Public statistics

See `backend/README.md` for complete API documentation.

## 🎨 Frontend Updates

### New Features

1. **Transparency Page** (`/transparency`)
   - Public stats display
   - Donation ledger
   - Trust indicators

2. **Payment Integration**
   - Stripe payment form
   - Payment status tracking
   - Receipt generation

3. **Verification UI**
   - Document upload component
   - Status badges
   - Verification workflow

4. **Enhanced Request Flow**
   - Draft → Submit → Verify flow
   - Status indicators
   - Progress tracking

## 🚢 Deployment

### Backend Deployment

1. **Environment Variables:**
   ```env
   NODE_ENV=production
   DATABASE_URL=postgresql://...
   JWT_SECRET=<strong-secret>
   JWT_REFRESH_SECRET=<strong-secret>
   FRONTEND_URL=https://your-domain.com
   STRIPE_SECRET_KEY=sk_live_...
   ```

2. **Database:**
   - Run migrations: `npm run db:migrate`
   - Seed initial data: `npm run db:seed`

3. **Server:**
   - Use PM2 or similar process manager
   - Enable HTTPS
   - Configure reverse proxy (nginx)

### Frontend Deployment

1. **Build:**
   ```bash
   npm run build
   ```

2. **Environment:**
   ```env
   VITE_API_URL=https://api.your-domain.com/api
   ```

3. **Deploy:**
   - Static hosting (Vercel, Netlify)
   - Or serve with nginx

### Recommended Stack

- **Backend**: Railway, Render, or DigitalOcean
- **Database**: PostgreSQL on Railway, Supabase, or AWS RDS
- **Frontend**: Vercel or Netlify
- **File Storage**: AWS S3 or Cloudinary (for documents)

## 📝 Testing

### Backend Testing

```bash
# Test database connection
npm run db:studio

# Test API endpoints
# Use Postman or curl
curl http://localhost:3000/api/health
```

### Frontend Testing

1. Login with test accounts
2. Create donation request
3. Make test donation
4. Verify transparency page

## 🐛 Troubleshooting

### Common Issues

1. **Database connection failed**
   - Check DATABASE_URL in .env
   - Verify PostgreSQL is running
   - Check database exists

2. **JWT errors**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Verify token format

3. **CORS errors**
   - Check FRONTEND_URL in backend .env
   - Verify CORS middleware configuration

4. **Payment failures**
   - Check Stripe keys are correct
   - Verify webhook endpoint
   - Check payment intent status

## 📚 Additional Resources

- [Backend README](./backend/README.md)
- [Backend Integration Guide](./BACKEND_INTEGRATION.md)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Stripe API Reference](https://stripe.com/docs/api)

## ✅ Upgrade Checklist

- [x] Backend architecture created
- [x] Database schema designed
- [x] Authentication implemented
- [x] API endpoints created
- [x] Payment integration (Stripe)
- [x] Verification system
- [x] Transparency features
- [x] Security measures
- [x] Documentation
- [ ] Frontend payment UI
- [ ] Document upload UI
- [ ] Impact report UI
- [ ] Production deployment

## 🎓 Academic Project Notes

This upgrade transforms SEDS from a demo to a production-grade system suitable for:

- **Final Year Project**: Demonstrates full-stack development
- **Portfolio**: Shows real-world engineering practices
- **Interview**: Demonstrates system design skills

### Key Demonstrations

1. **System Architecture**: Clean separation of concerns
2. **Security**: Industry-standard practices
3. **Scalability**: Database design, API structure
4. **Transparency**: Real-world trust mechanisms
5. **Documentation**: Production-quality docs

---

**Note**: This is a production-grade upgrade suitable for academic evaluation and portfolio demonstration. For actual production deployment, additional security audits and testing are recommended.

