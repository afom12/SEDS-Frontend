// Data service that simulates API calls with realistic delays
import { storage, STORAGE_KEYS } from '../utils/storage';

// Simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate random success/failure (95% success rate)
const simulateSuccess = () => Math.random() > 0.05;

export const dataService = {
  // Get donation requests
  async getDonationRequests() {
    await delay(300);
    const requests = storage.get(STORAGE_KEYS.DONATION_REQUESTS) || [];
    return { success: true, data: requests };
  },

  // Get single request
  async getRequestById(id) {
    await delay(200);
    const requests = storage.get(STORAGE_KEYS.DONATION_REQUESTS) || [];
    const request = requests.find(r => r.id === id);
    if (!request) {
      return { success: false, error: 'Request not found' };
    }
    return { success: true, data: request };
  },

  // Create donation
  async createDonation(donationData) {
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
  },

  // Submit request
  async submitRequest(requestData) {
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
  },

  // Get receiver requests
  async getReceiverRequests() {
    await delay(300);
    const requests = storage.get(STORAGE_KEYS.RECEIVER_REQUESTS) || [];
    return { success: true, data: requests };
  },

  // Get donations
  async getDonations() {
    await delay(300);
    const donations = storage.get(STORAGE_KEYS.DONATIONS) || [];
    return { success: true, data: donations };
  },

  // Approve request (admin)
  async approveRequest(requestId) {
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
      receiverRequest.adminNotes = 'Request verified and approved.';
    }

    storage.set(STORAGE_KEYS.DONATION_REQUESTS, requests);
    storage.set(STORAGE_KEYS.RECEIVER_REQUESTS, receiverRequests);

    return { success: true, data: request };
  },

  // Reject request (admin)
  async rejectRequest(requestId) {
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
      receiverRequest.adminNotes = 'Request rejected after review.';
    }

    storage.set(STORAGE_KEYS.DONATION_REQUESTS, requests);
    storage.set(STORAGE_KEYS.RECEIVER_REQUESTS, receiverRequests);

    return { success: true, data: request };
  },

  // Get users (admin)
  async getUsers() {
    await delay(400);
    const users = storage.get(STORAGE_KEYS.USERS) || [];
    return { success: true, data: users };
  },

  // Get activity logs (admin)
  async getActivityLogs() {
    await delay(300);
    const logs = storage.get(STORAGE_KEYS.ACTIVITY_LOGS) || [];
    return { success: true, data: logs };
  },
};

