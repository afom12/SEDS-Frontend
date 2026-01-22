# SEDS - Transparent Donation Platform

A **production-grade**, full-stack donation platform built with React, Node.js, Express, and PostgreSQL. Focused on transparency, dignity, and trust.

> 🎉 **Production Upgrade Complete!** This is no longer a demo - it's a real, deployable platform with backend API, payment integration, and verification systems.

## 🚀 Features

### Core Features
- **Three User Roles**: Admin, Donor, and Receiver
- **Anonymous Donations**: Option to donate anonymously
- **Verified Requests**: All requests go through admin verification
- **Role-Based Dashboards**: Customized interface for each user type
- **Protected Routes**: Secure access control based on user roles
- **Modern UI**: Clean, accessible, and professional design
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Bilingual Support**: Full English and Amharic translation support

### Enhanced Features ✨
- **Error Boundary**: Graceful error handling with user-friendly error pages
- **Advanced Form Validation**: Real-time validation with visual feedback
- **Dark Mode**: Full dark theme support with system preference detection
- **Keyboard Shortcuts**: Power user shortcuts (Ctrl+K for search, Alt+D for dashboard, etc.)
- **Advanced Search & Filtering**: Multi-filter search with pagination
- **Data Visualization**: Charts and graphs for analytics (Bar, Line, Pie charts)
- **Export Functionality**: Export data to CSV, JSON, or print as PDF
- **Social Sharing**: Share pages via social media or copy links
- **Tooltips & Help System**: Contextual help throughout the app
- **Performance Optimizations**: Code splitting, lazy loading, and optimized rendering
- **Accessibility**: WCAG compliant with ARIA labels, keyboard navigation, and skip links
- **Enhanced Empty States**: Actionable empty states with helpful CTAs
- **Loading States**: Skeleton loaders and smooth loading transitions
- **Visual Polish**: Smooth animations, micro-interactions, and transitions

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library with Suspense and lazy loading
- **React Router v6** - Navigation and routing
- **Tailwind CSS** - Utility-first CSS framework with dark mode
- **React Icons** - Comprehensive icon library
- **React i18next** - Internationalization (English & Amharic)
- **Vite** - Fast build tool and dev server

### Backend (NEW!)
- **Node.js + Express** - RESTful API server
- **PostgreSQL** - Production database
- **Prisma** - Modern ORM
- **JWT** - Authentication with refresh tokens
- **Stripe** - Payment processing (test mode)
- **Chapa** - Ethiopia payment gateway (placeholder)

## 📦 Quick Start

**See [QUICK_START.md](./QUICK_START.md) for detailed setup instructions.**

### Quick Setup

1. **Install dependencies:**
   ```bash
   npm install
   cd backend && npm install && cd ..
   ```

2. **Setup database:**
   ```bash
   createdb seds_db
   cd backend
   cp .env.example .env
   # Edit .env with your database URL
   npm run db:migrate
   npm run db:seed
   ```

3. **Start backend:**
   ```bash
   cd backend
   npm run dev
   ```

4. **Start frontend (new terminal):**
   ```bash
   echo "VITE_API_URL=http://localhost:3000/api" > .env
   npm run dev
   ```

5. **Access:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000/api

## 🔐 Demo Accounts

For testing purposes, you can use these demo accounts:

- **Admin**: 
  - Email: `admin@seds.com`
  - Password: `admin123`

- **Donor**: 
  - Email: `donor@seds.com`
  - Password: `donor123`

- **Receiver**: 
  - Email: `receiver@seds.com`
  - Password: `receiver123`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Card.jsx
│   ├── Modal.jsx
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── Sidebar.jsx
│   ├── StatusBadge.jsx
│   ├── Stepper.jsx
│   ├── ProtectedRoute.jsx
│   ├── ErrorBoundary.jsx      # Error handling
│   ├── FormField.jsx          # Enhanced form fields
│   ├── PasswordStrength.jsx   # Password strength indicator
│   ├── Tooltip.jsx            # Tooltip component
│   ├── Pagination.jsx         # Pagination component
│   ├── AdvancedSearch.jsx     # Advanced search/filter
│   ├── Chart.jsx              # Data visualization
│   ├── ExportButton.jsx       # Export functionality
│   ├── ShareButton.jsx        # Social sharing
│   ├── ThemeToggle.jsx        # Dark mode toggle
│   ├── KeyboardShortcutsModal.jsx  # Shortcuts help
│   └── SkipToContent.jsx      # Accessibility skip link
├── context/            # React Context providers
│   ├── AuthContext.jsx
│   ├── ToastContext.jsx
│   └── ThemeContext.jsx       # Dark mode management
├── hooks/               # Custom React hooks
│   └── useKeyboardShortcuts.js
├── utils/               # Utility functions
│   ├── storage.js       # LocalStorage utilities
│   ├── validators.js    # Form validation
│   ├── export.js        # Export utilities
│   ├── performance.js   # Performance helpers
│   └── devUtils.js      # Development utilities
├── i18n/                # Internationalization
│   ├── config.js
│   └── locales/
│       ├── en.json      # English translations
│       └── am.json      # Amharic translations
├── services/            # Service layer
│   └── dataService.js   # Mock API service
├── data/               # Mock data
│   └── mockData.js
├── pages/              # Page components
│   ├── Landing.jsx
│   ├── auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── donor/
│   │   ├── DonorDashboard.jsx
│   │   ├── BrowseRequests.jsx
│   │   ├── RequestDetails.jsx
│   │   └── DonationHistory.jsx
│   ├── receiver/
│   │   ├── ReceiverDashboard.jsx
│   │   ├── SubmitRequest.jsx
│   │   ├── RequestStatus.jsx
│   │   └── Profile.jsx
│   └── admin/
│       ├── AdminDashboard.jsx
│       ├── ReviewRequests.jsx
│       ├── UserManagement.jsx
│       ├── Analytics.jsx
│       └── ActivityLogs.jsx
├── App.jsx             # Main app component with routing
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## 🎨 Design System

### Colors
- **Primary**: Deep Blue (#2563eb) - Trust & stability
- **Secondary**: Soft Green (#10b981) - Hope & giving
- **Accent**: Teal (#14b8a6) - Emphasis
- **Background**: Off-white (#f9fafb)
- **Text**: Dark gray (#374151)

### Design Principles
- Rounded corners
- Soft shadows
- Clear typography
- Accessible contrast
- No judgment policy

## 🔒 Role-Based Access

### Donor
- Browse verified donation requests
- Make anonymous or public donations
- Track donation status
- View donation history

### Receiver
- Submit donation requests
- Upload supporting documents
- View request status
- See received donations (anonymous)

### Admin
- User management
- Request verification
- Donation monitoring
- Analytics and reports

## ✨ Implemented Enhancements

### Error Handling & Validation
- ✅ Error Boundary component for graceful error handling
- ✅ Real-time form validation with visual feedback
- ✅ Password strength indicator
- ✅ Comprehensive validation utilities

### User Experience
- ✅ Dark mode with system preference detection
- ✅ Keyboard shortcuts (Ctrl+K, Alt+D, Alt+H, Alt+L, Esc)
- ✅ Advanced search with multi-filter support
- ✅ Pagination for large data sets
- ✅ Tooltips for contextual help
- ✅ Enhanced empty states with actionable CTAs
- ✅ Loading skeletons and smooth transitions
- ✅ Social sharing functionality
- ✅ Export to CSV, JSON, and PDF

### Accessibility
- ✅ ARIA labels and roles throughout
- ✅ Keyboard navigation support
- ✅ Skip to main content link
- ✅ Screen reader support
- ✅ Focus management
- ✅ High contrast support

### Performance
- ✅ Code splitting with React.lazy
- ✅ Lazy loading for all routes
- ✅ Debounced search inputs
- ✅ Memoization utilities
- ✅ Optimized rendering

### Data Visualization
- ✅ Bar charts
- ✅ Line charts
- ✅ Pie charts
- ✅ Responsive chart components

### Internationalization
- ✅ Full English translation
- ✅ Full Amharic translation
- ✅ Language persistence
- ✅ Language toggle in navbar

## 🔌 Backend Integration

The frontend is now configured to work with your backend API. The integration includes:

### Setup

1. **Environment Configuration**
   - Create a `.env` file in the root directory
   - Add your backend API URL:
     ```
     VITE_API_URL=http://localhost:3000/api
     ```
   - Replace with your actual backend URL

2. **API Client**
   - Located in `src/services/apiClient.js`
   - Handles authentication tokens automatically
   - Includes error handling and timeout management
   - Automatically redirects to login on 401 errors

3. **API Configuration**
   - Endpoints are configured in `src/config/api.js`
   - Update endpoints to match your backend API structure

### Features

- ✅ **Automatic Fallback**: Falls back to mock data if backend is unavailable
- ✅ **Token Management**: Automatic JWT token handling
- ✅ **Error Handling**: Comprehensive error handling with user-friendly messages
- ✅ **Request Timeout**: Configurable timeout for API requests
- ✅ **Authentication**: Integrated with AuthContext for seamless auth flow

### API Endpoints Expected

The frontend expects the following API structure:

**Authentication:**
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user

**Donation Requests:**
- `GET /requests` - Get all donation requests
- `GET /requests/:id` - Get request by ID
- `POST /requests` - Submit new request
- `POST /requests/:id/approve` - Approve request (admin)
- `POST /requests/:id/reject` - Reject request (admin)
- `GET /requests/receiver` - Get receiver's requests

**Donations:**
- `GET /donations` - Get all donations
- `POST /donations` - Create donation
- `GET /donations/history` - Get donation history

**Users (Admin):**
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID

**Admin:**
- `GET /admin/analytics` - Get analytics data
- `GET /admin/activity-logs` - Get activity logs
- `GET /admin/stats` - Get statistics

### Response Format

The API should return responses in this format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

For errors:
```json
{
  "success": false,
  "error": "Error message",
  "message": "Error message"
}
```

### Authentication

- Tokens are stored in `sessionStorage` by default
- Include token in `Authorization: Bearer <token>` header
- Token is automatically included in all API requests

## 🎉 Production Features (NEW!)

### ✅ Implemented
- ✅ **Full Backend API** - Node.js + Express + PostgreSQL
- ✅ **Payment Integration** - Stripe (test mode) ready
- ✅ **Verification System** - Complete admin workflow
- ✅ **Transparency Page** - Public donation ledger
- ✅ **Audit Logs** - Immutable admin action tracking
- ✅ **JWT Authentication** - Access + refresh tokens
- ✅ **Role-Based Security** - Admin, Donor, Receiver
- ✅ **Document Upload** - Backend ready

### 🚧 Future Enhancements
- Real-time notifications
- Email notifications
- Chapa payment integration (Ethiopia)
- Push notifications
- Real-time chat support
- Mobile app development
- Advanced reporting

## 📝 License

This project is created for educational purposes.

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Get started in 5 minutes
- **[PRODUCTION_UPGRADE.md](./PRODUCTION_UPGRADE.md)** - Complete upgrade guide
- **[UPGRADE_SUMMARY.md](./UPGRADE_SUMMARY.md)** - What's new summary
- **[backend/README.md](./backend/README.md)** - Backend API documentation
- **[BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md)** - Frontend-backend integration

## 👥 Contributing

This is a production-grade platform suitable for:
- ✅ Final-year software engineering projects
- ✅ Portfolio demonstrations
- ✅ Academic evaluation
- ✅ Real-world deployment (with proper security audit)

**Backend is fully integrated!** See [QUICK_START.md](./QUICK_START.md) to get started.





