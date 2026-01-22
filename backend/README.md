# SEDS Backend API

Production-grade backend API for the SEDS (Transparent Donation Platform) built with Node.js, Express, PostgreSQL, and Prisma.

## 🏗️ Architecture

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (Access + Refresh Tokens)
- **Payment**: Stripe (Test Mode) + Chapa (Ethiopia)
- **Security**: Helmet, CORS, Rate Limiting, Input Validation

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Update the following variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Random secret for JWT signing
- `JWT_REFRESH_SECRET` - Random secret for refresh tokens
- `STRIPE_SECRET_KEY` - Stripe test secret key
- `CHAPA_SECRET_KEY` - Chapa test secret key (optional)

### 3. Setup Database

```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database (optional)
npm run db:seed
```

### 4. Start Server

```bash
# Development
npm run dev

# Production
npm start
```

Server runs on `http://localhost:3000`

## 📊 Database Schema

### Core Models

- **User**: Users with roles (ADMIN, DONOR, RECEIVER)
- **Request**: Donation requests with status lifecycle
- **Donation**: Donations linked to requests
- **Transaction**: Payment gateway transactions
- **Document**: Verification documents and proof
- **ImpactReport**: Impact reports with photos
- **AdminLog**: Immutable audit trail

### Status Lifecycle

**Request Status Flow:**
```
DRAFT → SUBMITTED → VERIFIED → FUNDED → COMPLETED
                ↓
            REJECTED
```

**Payment Status:**
```
PENDING → PROCESSING → COMPLETED
                    ↓
                 FAILED
```

## 🔐 Authentication

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "User Name",
  "role": "DONOR" | "RECEIVER"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh_token"
}
```

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <access_token>
```

## 📡 API Endpoints

### Requests

- `GET /api/requests` - Get all requests (with filters)
- `GET /api/requests/public` - Public verified requests
- `GET /api/requests/:id` - Get request by ID
- `POST /api/requests` - Create request (RECEIVER only)
- `PUT /api/requests/:id` - Update request
- `POST /api/requests/:id/submit` - Submit for verification
- `GET /api/requests/receiver` - Get receiver's requests

### Donations

- `POST /api/donations` - Create donation (DONOR only)
- `GET /api/donations` - Get donations
- `GET /api/donations/history` - Get donation history
- `GET /api/donations/:id` - Get donation by ID

### Payments

- `POST /api/payments/intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment
- `GET /api/payments/status/:donationId` - Get payment status
- `POST /api/payments/webhooks/stripe` - Stripe webhook
- `POST /api/payments/webhooks/chapa` - Chapa webhook

### Admin

- `POST /api/admin/requests/:id/approve` - Approve request
- `POST /api/admin/requests/:id/reject` - Reject request
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users/:id/verify` - Verify user
- `GET /api/admin/analytics` - Get analytics
- `GET /api/admin/stats` - Get statistics
- `GET /api/admin/logs` - Get activity logs

### Transparency (Public)

- `GET /api/transparency/ledger` - Public donation ledger
- `GET /api/transparency/requests/:id` - Public request details
- `GET /api/transparency/stats` - Public statistics

### Users

- `PUT /api/users/profile` - Update profile
- `POST /api/users/documents` - Upload document
- `GET /api/users/documents` - Get documents

## 🔒 Security Features

1. **JWT Authentication**: Access + Refresh token pattern
2. **Role-Based Authorization**: Middleware for role checks
3. **Rate Limiting**: 100 requests per 15 minutes
4. **Input Validation**: express-validator
5. **Helmet**: Security headers
6. **CORS**: Configured for frontend origin
7. **Password Hashing**: bcryptjs (12 rounds)
8. **SQL Injection Protection**: Prisma ORM

## 💳 Payment Integration

### Stripe (Test Mode)

1. Create payment intent:
```http
POST /api/payments/intent
{
  "donationId": "uuid",
  "paymentMethod": "STRIPE"
}
```

2. Use `clientSecret` with Stripe.js on frontend

3. Webhook handles payment confirmation automatically

### Chapa (Ethiopia)

Chapa integration placeholder - implement based on Chapa API documentation.

## 📝 Admin Audit Logs

All admin actions are logged immutably:
- Request approval/rejection
- User verification
- Status changes

Logs include:
- Admin ID
- Action type
- Entity type and ID
- Timestamp
- IP address
- User agent

## 🧪 Testing

```bash
# Run database migrations
npm run db:migrate

# Seed test data
npm run db:seed

# Open Prisma Studio (database GUI)
npm run db:studio
```

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=<strong-random-secret>
JWT_REFRESH_SECRET=<strong-random-secret>
FRONTEND_URL=https://your-frontend-domain.com
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Security Checklist

- [ ] Change all default secrets
- [ ] Use strong JWT secrets (32+ characters)
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable database backups
- [ ] Set up monitoring/logging
- [ ] Review file upload limits
- [ ] Configure webhook secrets

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Stripe API Reference](https://stripe.com/docs/api)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)

## 🤝 Contributing

This is a production-grade backend for academic/final-year project purposes. Follow best practices:

1. Always validate input
2. Use transactions for multi-step operations
3. Log admin actions
4. Handle errors gracefully
5. Write clear error messages
6. Test payment flows thoroughly

## 📄 License

MIT License - Educational purposes

