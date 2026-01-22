# 🌟 SEDS - Transparent Aid Coordination Platform

> **SEDS** (Share & Donor System) is a production-grade, transparent aid coordination platform that connects aid seekers with aid providers. Built with modern web technologies, it ensures trust, verification, and accountability in humanitarian aid distribution.

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

SEDS is a comprehensive aid coordination platform designed to facilitate transparent and efficient distribution of humanitarian aid. The platform supports multiple aid types including food, clothing, medical assistance, cash support, school supplies, and housing assistance.

### Key Principles

- **Transparency**: All donations and aid distributions are publicly trackable
- **Verification**: Identity verification ensures trust and accountability
- **Dignity**: User-friendly interface designed for low-literacy users
- **Efficiency**: Smart matching algorithm connects aid seekers with providers
- **Urgency**: Food-specific urgency system prevents waste and prioritizes critical needs

---

## ✨ Features

### Core Functionality

- **Multi-Type Aid Support**
  - Food (urgent/perishable, ceremony/event)
  - Clothing and textiles
  - Medical assistance
  - Cash support
  - School supplies
  - Housing/shelter support
  - Custom aid types

- **User Roles**
  - **Aid Seekers**: Register needs, track requests, receive aid
  - **Aid Providers**: Offer aid, browse requests, track deliveries
  - **Organizations**: Manage group requests, verify members
  - **Administrators**: Verify users, approve requests, monitor platform

- **Verification System**
  - Document upload (ID cards, medical reports, recommendation letters)
  - Admin verification workflow
  - Organization-based verification
  - Verified badges and trust indicators

- **Smart Matching**
  - Automatic matching of aid offers to requests
  - Priority-based algorithm (urgency, location, type)
  - Food expiration tracking
  - Real-time availability updates

- **Delivery Tracking**
  - Delivery status updates
  - Proof of delivery (photos)
  - Receiver confirmation
  - Delivery history

- **Food Urgency System**
  - Automatic urgency calculation based on expiration dates
  - "MUST BE GIVEN TODAY" alerts for expiring food
  - Scheduled updates via cron jobs
  - Visual urgency indicators

- **Transparency & Audit**
  - Public transparency page (no login required)
  - Donation ledger
  - Admin action logs
  - Impact reports with photos

- **Analytics Dashboard**
  - Real-time statistics (derived from actual data)
  - Donation trends
  - Request completion rates
  - Food waste prevention metrics

---

## 🛠 Technology Stack

### Frontend

- **React 18** - Modern UI library
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React Icons** - Icon library
- **Axios** - HTTP client
- **React i18next** - Internationalization (English/Amharic)
- **Vite** - Build tool and dev server

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Relational database
- **Prisma ORM** - Database toolkit
- **JWT** - Authentication (access + refresh tokens)
- **Bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Express Rate Limit** - API rate limiting
- **Helmet** - Security headers

### Development Tools

- **Git** - Version control
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

---

## 🏗 Architecture

### System Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   React Frontend │ ◄─────► │  Express Backend │ ◄─────► │   PostgreSQL DB  │
│   (Port 5173)    │   REST  │   (Port 3000)    │  Prisma │   (Port 5432)   │
└─────────────────┘         └─────────────────┘         └─────────────────┘
         │                            │
         │                            │
         ▼                            ▼
┌─────────────────┐         ┌─────────────────┐
│  Browser Storage │         │   File Storage   │
│  (Session/Local) │         │   (Documents)    │
└─────────────────┘         └─────────────────┘
```

### Database Schema

- **Users** - User accounts with roles and verification
- **Requests** - Aid requests with status tracking
- **AidOffers** - Available aid offers
- **AidTypes** - Predefined aid categories
- **Deliveries** - Delivery tracking and proof
- **Organizations** - Trusted organizations
- **Documents** - Verification documents
- **AdminLogs** - Audit trail
- **Donations** - Financial donations (legacy)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **PostgreSQL** 15+
- **Git**

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/afom12/SEDS-Frontend.git
cd SEDS-Frontend
```

#### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
npx prisma migrate dev

# Seed aid types
node prisma/seed-aid-types.js

# Start backend server
npm run dev
```

Backend will run on `http://localhost:3000`

#### 3. Frontend Setup

```bash
# Return to root directory
cd ..

# Install dependencies
npm install

# Set up environment variables (optional)
# Create .env file:
# VITE_API_URL=http://localhost:3000/api

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

### Quick Start (Development Mode)

Development mode automatically bypasses verification checks for testing:

```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
npm run dev
```

Visit `http://localhost:5173` and start testing!

---

## 📁 Project Structure

```
SEDS_Frontend/
├── backend/                 # Backend API server
│   ├── controllers/         # Request handlers
│   ├── routes/             # API routes
│   ├── middleware/         # Auth, validation, error handling
│   ├── utils/              # Utilities (JWT, matching, urgency)
│   ├── prisma/             # Database schema and migrations
│   └── server.js           # Express app entry point
│
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   │   ├── aid-seeker/    # Aid seeker pages
│   │   ├── aid-provider/  # Aid provider pages
│   │   ├── admin/         # Admin pages
│   │   └── auth/          # Authentication pages
│   ├── services/          # API service layer
│   ├── context/           # React context (Auth, Toast)
│   ├── config/            # Configuration files
│   ├── utils/             # Frontend utilities
│   └── App.jsx            # Main app component
│
├── public/                # Static assets
├── docs/                 # Documentation files
└── README.md            # This file
```

---

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user

### Aid Coordination Endpoints

- `GET /api/aid-types` - List all aid types
- `POST /api/requests` - Create aid request
- `GET /api/requests` - List requests (with filters)
- `POST /api/aid-offers` - Create aid offer
- `GET /api/aid-offers` - List available offers
- `POST /api/deliveries` - Create delivery record
- `GET /api/deliveries` - List deliveries

### Admin Endpoints

- `GET /api/admin/users` - List users
- `POST /api/admin/users/:id/verify` - Verify user
- `GET /api/admin/requests` - List requests
- `POST /api/admin/requests/:id/approve` - Approve request
- `GET /api/admin/analytics` - Platform analytics

### Cron Jobs

- `GET /api/cron/update-food-urgency` - Update food urgency levels
- `GET /api/cron/expire-items` - Mark expired items
- `GET /api/cron/run-all` - Run all cron jobs

**Note**: Cron endpoints require `X-API-Key` header.

---

## 🚢 Deployment

### Environment Variables

#### Backend (.env)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/seds_db"

# JWT
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Server
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com

# Cron
CRON_API_KEY="your-cron-api-key"

# Bcrypt
BCRYPT_ROUNDS=12
```

#### Frontend (.env)

```env
VITE_API_URL=https://your-backend-domain.com/api
```

### Production Build

```bash
# Frontend
npm run build
# Output: dist/

# Backend
# Use PM2 or similar process manager
pm2 start backend/server.js --name seds-backend
```

### Database Migration

```bash
cd backend
npx prisma migrate deploy
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features
- Test thoroughly before submitting

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Development Team** - [afom12](https://github.com/afom12)

---

## 🙏 Acknowledgments

- Built for final-year software engineering project
- Designed with dignity-first principles for humanitarian aid
- Inspired by real-world aid coordination needs

---

## 📞 Support

For issues, questions, or contributions:

- **GitHub Issues**: [Create an issue](https://github.com/afom12/SEDS-Frontend/issues)
- **Documentation**: See `/docs` folder for detailed guides

---

## 🔗 Related Documentation

- [Setup Instructions](SETUP_INSTRUCTIONS.md)
- [Backend Setup](backend/README.md)
- [Food Urgency System](FOOD_URGENCY_SYSTEM.md)
- [Development Mode Guide](DEV_MODE_GUIDE.md)
- [API Integration Guide](FRONTEND_BACKEND_INTEGRATION.md)

---

<div align="center">

**Made with ❤️ for transparent humanitarian aid coordination**

[⬆ Back to Top](#-seds---transparent-aid-coordination-platform)

</div>
