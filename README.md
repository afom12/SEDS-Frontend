# 🌟 SEDS - Transparent Aid Coordination Platform (Frontend)

> **SEDS** (Share & Donor System) is a transparent aid coordination platform UI that connects aid seekers with aid providers. This repository contains the frontend application built with modern web technologies.

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.3.1-646CFF?logo=vite)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

SEDS is a comprehensive aid coordination platform UI designed to facilitate transparent and efficient distribution of humanitarian aid. The frontend supports multiple aid types including food, clothing, medical assistance, cash support, school supplies, and housing assistance.

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

### Development Tools

- **Git** - Version control
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

---

## 🏗 Architecture

### UI Architecture

```
┌─────────────────┐         ┌──────────────────────┐
│  React Frontend │ ◄─────► │  External API Server │
│   (Port 5173)   │   REST  │   (Configured URL)   │
└─────────────────┘         └──────────────────────┘
        │
        ▼
┌─────────────────┐
│  Browser Storage │
│  (Session/Local) │
└─────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Git**

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/afom12/SEDS-Frontend.git
cd SEDS-Frontend
```

#### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Set up environment variables (optional)
# Create .env file:
# VITE_API_URL=http://localhost:3000/api/v1

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

### Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` and start testing. If no API is available, the UI falls back to mock data for many views.

---

## 📁 Project Structure

```
SEDS_Frontend/
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
└── README.md            # This file
```

---

## 📚 API Integration

The frontend expects a REST API at the base URL defined by `VITE_API_URL`.
If not set, it defaults to `http://localhost:3000/api/v1`.

The UI includes a mock-data fallback for many screens so development can continue without an API.
To integrate with a backend, point `VITE_API_URL` to your server and ensure it supports the endpoints used in `src/config/api.js`.

---

## 🚢 Deployment

### Environment Variables

#### Frontend (.env)

```env
VITE_API_URL=https://your-backend-domain.com/api/v1
```

### Production Build

```bash
npm run build
# Output: dist/
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
- **Documentation**: See the root `.md` files for detailed guides

---

## 🔗 Related Documentation

- [Setup Instructions](SETUP_INSTRUCTIONS.md)
- [Food Urgency System](FOOD_URGENCY_SYSTEM.md)
- [Development Mode Guide](DEV_MODE_GUIDE.md)
- [API Integration Guide](FRONTEND_BACKEND_INTEGRATION.md)

---

<div align="center">

**Made with ❤️ for transparent humanitarian aid coordination**

[⬆ Back to Top](#-seds---transparent-aid-coordination-platform)

</div>
