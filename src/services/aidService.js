// Aid Coordination Service
// Handles API calls for aid coordination features
import apiClient from './apiClient';
import { API_CONFIG } from '../config/api';

// Helper to handle API calls with fallback
const apiCallWithFallback = async (apiCall, fallbackData = null) => {
  try {
    const response = await apiCall();
    if (response && typeof response === 'object' && 'success' in response) {
      return response;
    }
    return { success: true, data: response };
  } catch (error) {
    console.warn('API call failed:', error);
    return { 
      success: false, 
      error: error.message || 'API call failed',
      data: fallbackData 
    };
  }
};

export const aidService = {
  // Get all aid types
  async getAidTypes(category = null) {
    return apiCallWithFallback(
      async () => {
        const url = category 
          ? `${API_CONFIG.ENDPOINTS.AID_TYPES.BASE}?category=${category}`
          : API_CONFIG.ENDPOINTS.AID_TYPES.BASE;
        return await apiClient.get(url);
      },
      []
    );
  },

  // Get aid type by ID
  async getAidTypeById(id) {
    return apiCallWithFallback(
      async () => {
        return await apiClient.get(API_CONFIG.ENDPOINTS.AID_TYPES.BY_ID(id));
      }
    );
  },

  // Create aid offer
  async createOffer(offerData) {
    return apiCallWithFallback(
      async () => {
        return await apiClient.post(API_CONFIG.ENDPOINTS.AID_OFFERS.BASE, offerData);
      }
    );
  },

  // Get aid offers
  async getOffers(filters = {}) {
    return apiCallWithFallback(
      async () => {
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            queryParams.append(key, value);
          }
        });
        const url = queryParams.toString()
          ? `${API_CONFIG.ENDPOINTS.AID_OFFERS.BASE}?${queryParams.toString()}`
          : API_CONFIG.ENDPOINTS.AID_OFFERS.BASE;
        return await apiClient.get(url);
      },
      []
    );
  },

  // Get available offers
  async getAvailableOffers(filters = {}) {
    return apiCallWithFallback(
      async () => {
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            queryParams.append(key, value);
          }
        });
        const url = queryParams.toString()
          ? `${API_CONFIG.ENDPOINTS.AID_OFFERS.AVAILABLE}?${queryParams.toString()}`
          : API_CONFIG.ENDPOINTS.AID_OFFERS.AVAILABLE;
        return await apiClient.get(url);
      },
      []
    );
  },

  // Get offer by ID
  async getOfferById(id) {
    return apiCallWithFallback(
      async () => {
        return await apiClient.get(API_CONFIG.ENDPOINTS.AID_OFFERS.BY_ID(id));
      }
    );
  },

  // Update offer
  async updateOffer(id, updateData) {
    return apiCallWithFallback(
      async () => {
        return await apiClient.put(API_CONFIG.ENDPOINTS.AID_OFFERS.BY_ID(id), updateData);
      }
    );
  },

  // Accept offer
  async acceptOffer(id, requestId) {
    return apiCallWithFallback(
      async () => {
        return await apiClient.post(API_CONFIG.ENDPOINTS.AID_OFFERS.ACCEPT(id), { requestId });
      }
    );
  },

  // Cancel offer
  async cancelOffer(id) {
    return apiCallWithFallback(
      async () => {
        return await apiClient.post(API_CONFIG.ENDPOINTS.AID_OFFERS.CANCEL(id));
      }
    );
  },

  // Create delivery
  async createDelivery(deliveryData) {
    return apiCallWithFallback(
      async () => {
        return await apiClient.post(API_CONFIG.ENDPOINTS.DELIVERIES.BASE, deliveryData);
      }
    );
  },

  // Get deliveries
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
      []
    );
  },

  // Get delivery by ID
  async getDeliveryById(id) {
    return apiCallWithFallback(
      async () => {
        return await apiClient.get(API_CONFIG.ENDPOINTS.DELIVERIES.BY_ID(id));
      }
    );
  },

  // Update delivery status
  async updateDeliveryStatus(id, status, notes = {}) {
    return apiCallWithFallback(
      async () => {
        return await apiClient.put(API_CONFIG.ENDPOINTS.DELIVERIES.STATUS(id), {
          status,
          ...notes,
        });
      }
    );
  },

  // Confirm delivery
  async confirmDelivery(id) {
    return apiCallWithFallback(
      async () => {
        return await apiClient.post(API_CONFIG.ENDPOINTS.DELIVERIES.CONFIRM(id));
      }
    );
  },

  // Get matching offers for request
  async getMatchingOffers(requestId) {
    return apiCallWithFallback(
      async () => {
        return await apiClient.get(`${API_CONFIG.ENDPOINTS.REQUESTS.BY_ID(requestId)}/matches`);
      },
      []
    );
  },

  // Match offer to request
  async matchOfferToRequest(requestId, offerId) {
    return apiCallWithFallback(
      async () => {
        return await apiClient.post(
          `${API_CONFIG.ENDPOINTS.REQUESTS.BY_ID(requestId)}/match/${offerId}`
        );
      }
    );
  },

  // Get organizations
  async getOrganizations(filters = {}) {
    return apiCallWithFallback(
      async () => {
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            queryParams.append(key, value);
          }
        });
        const url = queryParams.toString()
          ? `${API_CONFIG.ENDPOINTS.ORGANIZATIONS.BASE}?${queryParams.toString()}`
          : API_CONFIG.ENDPOINTS.ORGANIZATIONS.BASE;
        return await apiClient.get(url);
      },
      []
    );
  },
};

