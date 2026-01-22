// API Configuration
export const API_CONFIG = {
  // Base URL for the backend API
  // In development, this will use VITE_API_URL from .env
  // Fallback to localhost:3000 if not set
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  
  // API endpoints
  ENDPOINTS: {
    // Authentication
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh-token',
      ME: '/auth/me',
      CURRENT_USER: '/auth/current-user',
      VERIFY_EMAIL: (token) => `/auth/verify-email/${token}`,
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: (token) => `/auth/reset-password/${token}`,
      CHANGE_PASSWORD: '/auth/change-password',
      RESEND_VERIFICATION: '/auth/resend-email-verification',
    },
    
    // Items (Donations/Items)
    ITEMS: {
      BASE: '/items',
      ADMIN: '/items/admin',
      BY_ID: (id) => `/items/${id}`,
      APPROVE: (id) => `/items/${id}/approve`,
      REJECT: (id) => `/items/${id}/reject`,
    },
    
    // Requests
    REQUESTS: {
      BASE: '/requests',
      INCOMING: '/requests/incoming',
      OUTGOING: '/requests/outgoing',
      BY_ITEM_ID: (itemId) => `/requests/${itemId}`,
      APPROVE: (id) => `/requests/${id}/approve`,
      REJECT: (id) => `/requests/${id}/reject`,
    },
    
    // Categories
    CATEGORIES: {
      BASE: '/categories',
      BY_ID: (id) => `/categories/${id}`,
    },
    
    // Complaints
    COMPLAINTS: {
      BASE: '/complaints',
      RESOLVE: (id) => `/complaints/${id}/resolve`,
    },
    
    // Notifications
    NOTIFICATIONS: {
      BASE: '/notifications',
      MARK_READ: (id) => `/notifications/${id}/read`,
      ANNOUNCEMENT: '/notifications/announcement',
    },
    
    // Users
    USERS: {
      BASE: '/users',
      BY_ID: (id) => `/users/${id}`,
      UPDATE: (id) => `/users/${id}`,
      DELETE: (id) => `/users/${id}`,
    },
    
    // Admin
    ADMIN: {
      USERS: '/admin/users',
      USER_BY_ID: (id) => `/admin/users/${id}`,
      VERIFY_USER: (id) => `/admin/users/${id}/verify`,
      SUSPEND_USER: (id) => `/admin/users/${id}/suspend`,
      UPDATE_USER_ROLE: (id) => `/admin/users/${id}/role`,
      DELETE_USER: (id) => `/admin/users/${id}`,
    },
    
    // Health Check
    HEALTH: {
      BASE: '/healthcheck',
    },
    
    // Reports
    REPORTS: {
      BASE: '/reports',
    },
    
    // Legacy endpoints for backward compatibility
    DONATIONS: {
      BASE: '/items', // Maps to items
      BY_ID: (id) => `/items/${id}`,
      CREATE: '/items',
      HISTORY: '/items',
    },
    
    // Legacy request endpoints
    RECEIVER_REQUESTS: '/requests/incoming',
  },
  
  // Request timeout in milliseconds
  TIMEOUT: 30000,
};

