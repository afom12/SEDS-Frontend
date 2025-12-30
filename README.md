# SEDS - Transparent Donation Platform

A modern, role-based donation and sharing web platform built with React, focused on transparency, dignity, and trust.

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

- **React 18** - UI library with Suspense and lazy loading
- **React Router v6** - Navigation and routing
- **Tailwind CSS** - Utility-first CSS framework with dark mode
- **React Icons** - Comprehensive icon library
- **React i18next** - Internationalization (English & Amharic)
- **Vite** - Fast build tool and dev server

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

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

## 🚧 Future Enhancements (Backend Integration)

- Backend API integration
- Real-time notifications
- Payment gateway integration
- Advanced analytics with real data
- Email notifications
- Document upload functionality
- Push notifications
- Real-time chat support
- Advanced reporting
- Mobile app development

## 📝 License

This project is created for educational purposes.

## 👥 Contributing

This is a frontend-only implementation. Backend integration is planned for future development.





