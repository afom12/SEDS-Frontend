// Data service for API calls with fallback to mock data
import apiClient from './apiClient';
import { API_CONFIG } from '../config/api';
import { storage, STORAGE_KEYS } from '../utils/storage';

// Simulate network delay for mock data
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate random success/failure (95% success rate) for mock data
const simulateSuccess = () => Math.random() > 0.05;

// Helper to handle API calls with fallback to mock data
const apiCallWithFallback = async (apiCall, mockCall) => {
  try {
    const response = await apiCall();
    // If API returns data in { success, data } format, return as is
    // Otherwise, wrap it
    if (response && typeof response === 'object' && 'success' in response) {
      return response;
    }
    return { success: true, data: response };
  } catch (error) {
    console.warn('API call failed, using mock data:', error);
    // Fallback to mock data
    return await mockCall();
  }
};

export const dataService = {
  // Get donation requests
  async getDonationRequests() {
    return apiCallWithFallback(
      async () => {
        const response = await apiClient.get(API_CONFIG.ENDPOINTS.REQUESTS.BASE);
        return response;
      },
      async () => {
        await delay(300);
        const requests = storage.get(STORAGE_KEYS.DONATION_REQUESTS) || [];
        return { success: true, data: requests };
      }
    );
  },

  // Get single request
  async getRequestById(id) {
    return apiCallWithFallback(
      async () => {
        const response = await apiClient.get(API_CONFIG.ENDPOINTS.REQUESTS.BY_ID(id));
        return response;
      },
      async () => {
        await delay(200);
        const requests = storage.get(STORAGE_KEYS.DONATION_REQUESTS) || [];
        const request = requests.find(r => r.id === id);
        if (!request) {
          return { success: false, error: 'Request not found' };
        }
        return { success: true, data: request };
      }
    );
  },

  // Create donation
  async createDonation(donationData) {
    return apiCallWithFallback(
      async () => {
        const response = await apiClient.post(
          API_CONFIG.ENDPOINTS.DONATIONS.CREATE,
          donationData
        );
        return response;
      },
      async () => {
        await delay(800);
        
        if (!simulateSuccess()) {
          return { success: false, error: 'Failed to process donation. Please try again.' };
        }

        const donations = storage.get(STORAGE_KEYS.DONATIONS) || [];
        const requests = storage.get(STORAGE_KEYS.DONATION_REQUESTS) || [];
        
        const newDonation = {
          id: Date.now().toString(),
          ...donationData,
          date: new Date().toISOString().split('T')[0],
          status: 'pending',
        };

        // Update request progress
        const request = requests.find(r => r.id === donationData.requestId);
        if (request) {
          request.currentAmount += donationData.amount;
          request.progress = Math.min(100, Math.round((request.currentAmount / request.amount) * 100));
          request.donorCount += 1;
          storage.set(STORAGE_KEYS.DONATION_REQUESTS, requests);
        }

        donations.push(newDonation);
        storage.set(STORAGE_KEYS.DONATIONS, donations);

        return { success: true, data: newDonation };
      }
    );
  },

  // Submit request
  async submitRequest(requestData) {
    return apiCallWithFallback(
      async () => {
        const response = await apiClient.post(
          API_CONFIG.ENDPOINTS.REQUESTS.BASE,
          requestData
        );
        return response;
      },
      async () => {
        await delay(1000);
        
        if (!simulateSuccess()) {
          return { success: false, error: 'Failed to submit request. Please try again.' };
        }

        const requests = storage.get(STORAGE_KEYS.DONATION_REQUESTS) || [];
        const receiverRequests = storage.get(STORAGE_KEYS.RECEIVER_REQUESTS) || [];
        
        const newRequest = {
          id: Date.now().toString(),
          ...requestData,
          status: 'submitted',
          currentAmount: 0,
          progress: 0,
          donorCount: 0,
          verified: false,
          createdAt: new Date().toISOString().split('T')[0],
          submittedAt: new Date().toISOString().split('T')[0],
          documents: requestData.documents || [],
          receiverName: 'Anonymous',
        };

        requests.push(newRequest);
        receiverRequests.push({
          ...newRequest,
          adminNotes: '',
        });

        storage.set(STORAGE_KEYS.DONATION_REQUESTS, requests);
        storage.set(STORAGE_KEYS.RECEIVER_REQUESTS, receiverRequests);

        return { success: true, data: newRequest };
      }
    );
  },

  // Get receiver requests
  async getReceiverRequests() {
    return apiCallWithFallback(
      async () => {
        const response = await apiClient.get(API_CONFIG.ENDPOINTS.REQUESTS.RECEIVER_REQUESTS);
        return response;
      },
      async () => {
        await delay(300);
        const requests = storage.get(STORAGE_KEYS.RECEIVER_REQUESTS) || [];
        return { success: true, data: requests };
      }
    );
  },

  // Get donations
  async getDonations() {
    return apiCallWithFallback(
      async () => {
        const response = await apiClient.get(API_CONFIG.ENDPOINTS.DONATIONS.BASE);
        return response;
      },
      async () => {
        await delay(300);
        const donations = storage.get(STORAGE_KEYS.DONATIONS) || [];
        return { success: true, data: donations };
      }
    );
  },

  // Get deliveries (for aid coordination)
  async getDeliveries(filters = {}) {
    return apiCallWithFallback(
      async () => {
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            queryParams.append(key, value);
          }
        });
        const url = queryParams.toString()
          ? `${API_CONFIG.ENDPOINTS.DELIVERIES.BASE}?${queryParams.toString()}`
          : API_CONFIG.ENDPOINTS.DELIVERIES.BASE;
        return await apiClient.get(url);
      },
      async () => {
        await delay(300);
        return { success: true, data: [] };
      }
    );
  },

  // Get donation history
  async getDonationHistory() {
    return apiCallWithFallback(
      async () => {
        const response = await apiClient.get(API_CONFIG.ENDPOINTS.DONATIONS.HISTORY);
        return response;
      },
      async () => {
        await delay(300);
        const donations = storage.get(STORAGE_KEYS.DONATIONS) || [];
        return { success: true, data: donations };
      }
    );
  },

  // Approve request (admin)
  async approveRequest(requestId, adminNotes = '') {
    return apiCallWithFallback(
      async () => {
        const response = await apiClient.post(
          API_CONFIG.ENDPOINTS.REQUESTS.APPROVE(requestId),
          { adminNotes }
        );
        return response;
      },
      async () => {
        await delay(600);
        
        if (!simulateSuccess()) {
          return { success: false, error: 'Failed to approve request. Please try again.' };
        }

        const requests = storage.get(STORAGE_KEYS.DONATION_REQUESTS) || [];
        const receiverRequests = storage.get(STORAGE_KEYS.RECEIVER_REQUESTS) || [];
        
        const request = requests.find(r => r.id === requestId);
        const receiverRequest = receiverRequests.find(r => r.id === requestId);
        
        if (request) {
          request.status = 'approved';
          request.verified = true;
          request.verifiedAt = new Date().toISOString().split('T')[0];
        }
        
        if (receiverRequest) {
          receiverRequest.status = 'approved';
          receiverRequest.verifiedAt = new Date().toISOString().split('T')[0];
          receiverRequest.adminNotes = adminNotes || 'Request verified and approved.';
        }

        storage.set(STORAGE_KEYS.DONATION_REQUESTS, requests);
        storage.set(STORAGE_KEYS.RECEIVER_REQUESTS, receiverRequests);

        return { success: true, data: request };
      }
    );
  },

  // Reject request (admin)
  async rejectRequest(requestId, adminNotes = '') {
    return apiCallWithFallback(
      async () => {
        const response = await apiClient.post(
          API_CONFIG.ENDPOINTS.REQUESTS.REJECT(requestId),
          { adminNotes }
        );
        return response;
      },
      async () => {
        await delay(600);
        
        if (!simulateSuccess()) {
          return { success: false, error: 'Failed to reject request. Please try again.' };
        }

        const requests = storage.get(STORAGE_KEYS.DONATION_REQUESTS) || [];
        const receiverRequests = storage.get(STORAGE_KEYS.RECEIVER_REQUESTS) || [];
        
        const request = requests.find(r => r.id === requestId);
        const receiverRequest = receiverRequests.find(r => r.id === requestId);
        
        if (request) {
          request.status = 'rejected';
        }
        
        if (receiverRequest) {
          receiverRequest.status = 'rejected';
          receiverRequest.adminNotes = adminNotes || 'Request rejected after review.';
        }

        storage.set(STORAGE_KEYS.DONATION_REQUESTS, requests);
        storage.set(STORAGE_KEYS.RECEIVER_REQUESTS, receiverRequests);

        return { success: true, data: request };
      }
    );
  },

  // Get users (admin) - REAL DATA ONLY
  async getUsers() {
    return apiCallWithFallback(
      async () => {
        const response = await apiClient.get(API_CONFIG.ENDPOINTS.ADMIN.USERS);
        return response;
      },
      async () => {
        // Return empty array if API fails - NO FAKE DATA
        await delay(400);
        return { success: true, data: [] };
      }
    );
  },

  // Get activity logs (admin)
  async getActivityLogs() {
    return apiCallWithFallback(
      async () => {
        const response = await apiClient.get(API_CONFIG.ENDPOINTS.ADMIN.ACTIVITY_LOGS);
        return response;
      },
      async () => {
        await delay(300);
        const logs = storage.get(STORAGE_KEYS.ACTIVITY_LOGS) || [];
        return { success: true, data: logs };
      }
    );
  },

  // Get analytics (admin)
  async getAnalytics() {
    return apiCallWithFallback(
      async () => {
        const response = await apiClient.get(API_CONFIG.ENDPOINTS.ADMIN.ANALYTICS);
        return response;
      },
      async () => {
        await delay(300);
        return { success: true, data: {} };
      }
    );
  },

  // Get stats (admin) - REAL DATA ONLY
  async getStats() {
    return apiCallWithFallback(
      async () => {
        const response = await apiClient.get(API_CONFIG.ENDPOINTS.ADMIN.STATS);
        return response;
      },
      async () => {
        // Return empty stats if API fails - NO FAKE DATA
        await delay(300);
        return { 
          success: true, 
          data: {
            totals: {
              users: 0,
              donors: 0,
              receivers: 0,
              requests: 0,
              pendingRequests: 0,
              donations: 0,
              totalAmount: 0,
              completedRequests: 0,
            },
            last30Days: {
              donations: 0,
              requests: 0,
              users: 0,
            },
          }
        };
      }
    );
  },

  // Get analytics (admin) - REAL DATA ONLY
  async getAnalytics() {
    return apiCallWithFallback(
      async () => {
        const response = await apiClient.get(API_CONFIG.ENDPOINTS.ADMIN.ANALYTICS);
        return response;
      },
      async () => {
        // Return empty analytics if API fails - NO FAKE DATA
        await delay(300);
        return { 
          success: true, 
          data: {
            users: { total: 0, donors: 0, receivers: 0, recent: 0 },
            requests: { 
              total: 0, 
              verified: 0, 
              pending: 0, 
              rejected: 0, 
              completed: 0,
              funded: 0,
              recent: 0,
              totalRequested: 0,
              totalRaised: 0,
              byCategory: {},
              byStatus: {},
            },
            donations: { count: 0, totalAmount: 0, recent: 0 },
            platform: { fundingProgress: 0, averageDonation: 0 },
          }
        };
      }
    );
  },
};

