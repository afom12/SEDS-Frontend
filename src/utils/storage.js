// LocalStorage utilities for realistic data persistence

const STORAGE_KEYS = {
  DONATION_REQUESTS: 'seds_donation_requests',
  DONATIONS: 'seds_donations',
  RECEIVER_REQUESTS: 'seds_receiver_requests',
  USERS: 'seds_users',
  ACTIVITY_LOGS: 'seds_activity_logs',
};

export const storage = {
  // Get data from localStorage
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return null;
    }
  },

  // Set data to localStorage
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error);
      return false;
    }
  },

  // Remove data from localStorage
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage (${key}):`, error);
      return false;
    }
  },

  // Clear all SEDS data
  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },
};

// Initialize mock data in localStorage if not exists
export const initializeMockData = (mockData) => {
  if (!storage.get(STORAGE_KEYS.DONATION_REQUESTS)) {
    storage.set(STORAGE_KEYS.DONATION_REQUESTS, mockData.mockDonationRequests);
  }
  if (!storage.get(STORAGE_KEYS.DONATIONS)) {
    storage.set(STORAGE_KEYS.DONATIONS, mockData.mockDonations);
  }
  if (!storage.get(STORAGE_KEYS.RECEIVER_REQUESTS)) {
    storage.set(STORAGE_KEYS.RECEIVER_REQUESTS, mockData.mockReceiverRequests);
  }
  if (!storage.get(STORAGE_KEYS.USERS)) {
    storage.set(STORAGE_KEYS.USERS, mockData.mockUsers);
  }
  if (!storage.get(STORAGE_KEYS.ACTIVITY_LOGS)) {
    storage.set(STORAGE_KEYS.ACTIVITY_LOGS, mockData.mockActivityLogs);
  }
};

export { STORAGE_KEYS };

