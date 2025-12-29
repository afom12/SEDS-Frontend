# SEDS - Transparent Donation Platform

A modern, role-based donation and sharing web platform built with React, focused on transparency, dignity, and trust.

## 🚀 Features

- **Three User Roles**: Admin, Donor, and Receiver
- **Anonymous Donations**: Option to donate anonymously
- **Verified Requests**: All requests go through admin verification
- **Role-Based Dashboards**: Customized interface for each user type
- **Protected Routes**: Secure access control based on user roles
- **Modern UI**: Clean, accessible, and professional design
- **Responsive Design**: Works seamlessly on desktop and mobile

## 🛠️ Tech Stack

- **React 18** - UI library
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **React Icons** - Icon library
- **Vite** - Build tool

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
│   └── ProtectedRoute.jsx
├── context/            # React Context providers
│   └── AuthContext.jsx
├── data/               # Mock data
│   └── mockData.js
├── pages/              # Page components
│   ├── Landing.jsx
│   ├── auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── donor/
│   │   └── DonorDashboard.jsx
│   ├── receiver/
│   │   └── ReceiverDashboard.jsx
│   └── admin/
│       └── AdminDashboard.jsx
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

## 🚧 Future Enhancements

- Backend integration
- Real-time notifications
- Payment gateway integration
- Advanced analytics
- Email notifications
- Document upload functionality

## 📝 License

This project is created for educational purposes.

## 👥 Contributing

This is a frontend-only implementation. Backend integration is planned for future development.





