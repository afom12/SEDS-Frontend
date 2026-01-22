// API Configuration
export const API_CONFIG = {
  // Base URL for the backend API
  // In development, this will use VITE_API_URL from .env
  // Fallback to localhost:3000 if not set
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  
  // API endpoints
  ENDPOINTS: {
    // Authentication
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      ME: '/auth/me',
    },
    
    // Donation Requests
    REQUESTS: {
      BASE: '/requests',
      PUBLIC: '/requests/public',
      BY_ID: (id) => `/requests/${id}`,
      SUBMIT: (id) => `/requests/${id}/submit`,
      RECEIVER_REQUESTS: '/requests/receiver',
    },
    
    // Donations
    DONATIONS: {
      BASE: '/donations',
      BY_ID: (id) => `/donations/${id}`,
      CREATE: '/donations',
      HISTORY: '/donations/history',
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
      ANALYTICS: '/admin/analytics',
      ACTIVITY_LOGS: '/admin/logs',
      STATS: '/admin/stats',
      APPROVE_REQUEST: (id) => `/admin/requests/${id}/approve`,
      REJECT_REQUEST: (id) => `/admin/requests/${id}/reject`,
      VERIFY_USER: (id) => `/admin/users/${id}/verify`,
      USERS: '/admin/users',
      USER_BY_ID: (id) => `/admin/users/${id}`,
    },
    
    // Payments
    PAYMENTS: {
      CREATE_INTENT: '/payments/intent',
      CONFIRM: '/payments/confirm',
      STATUS: (donationId) => `/payments/status/${donationId}`,
    },
    
    // Transparency (Public)
    TRANSPARENCY: {
      LEDGER: '/transparency/ledger',
      REQUEST: (id) => `/transparency/requests/${id}`,
      STATS: '/transparency/stats',
    },
    
    // User Profile
    USER: {
      PROFILE: '/users/profile',
      DOCUMENTS: '/users/documents',
    },
    
    // Documents
    DOCUMENTS: {
      BASE: '/documents',
      UPLOAD: '/documents/upload',
      VERIFY: (id) => `/documents/${id}/verify`,
      BY_ID: (id) => `/documents/${id}`,
    },
    
    // Aid Coordination
    AID_TYPES: {
      BASE: '/aid-types',
      BY_ID: (id) => `/aid-types/${id}`,
    },
    AID_OFFERS: {
      BASE: '/aid-offers',
      AVAILABLE: '/aid-offers/available',
      BY_ID: (id) => `/aid-offers/${id}`,
      ACCEPT: (id) => `/aid-offers/${id}/accept`,
      CANCEL: (id) => `/aid-offers/${id}/cancel`,
    },
    DELIVERIES: {
      BASE: '/deliveries',
      BY_ID: (id) => `/deliveries/${id}`,
      STATUS: (id) => `/deliveries/${id}/status`,
      CONFIRM: (id) => `/deliveries/${id}/confirm`,
      PROOF: (id) => `/deliveries/${id}/proof`,
    },
    ORGANIZATIONS: {
      BASE: '/organizations',
      BY_ID: (id) => `/organizations/${id}`,
      VERIFY: (id) => `/organizations/${id}/verify`,
      MEMBERS: (id) => `/organizations/${id}/members`,
      REQUESTS: (id) => `/organizations/${id}/requests`,
    },
  },
  
  // Request timeout in milliseconds
  TIMEOUT: 30000,
};

