// API Client for making HTTP requests
import { API_CONFIG } from '../config/api';

class ApiClient {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  // Get access token from storage
  getAccessToken() {
    return sessionStorage.getItem('seds_access_token') || localStorage.getItem('seds_access_token');
  }

  // Get refresh token from storage
  getRefreshToken() {
    return sessionStorage.getItem('seds_refresh_token') || localStorage.getItem('seds_refresh_token');
  }

  // Set tokens (access + refresh)
  setTokens(accessToken, refreshToken, persist = false) {
    if (persist) {
      localStorage.setItem('seds_access_token', accessToken);
      localStorage.setItem('seds_refresh_token', refreshToken);
    } else {
      sessionStorage.setItem('seds_access_token', accessToken);
      sessionStorage.setItem('seds_refresh_token', refreshToken);
    }
  }

  // Clear all tokens
  clearTokens() {
    sessionStorage.removeItem('seds_access_token');
    sessionStorage.removeItem('seds_refresh_token');
    localStorage.removeItem('seds_access_token');
    localStorage.removeItem('seds_refresh_token');
  }

  // Legacy methods for backward compatibility
  getToken() {
    return this.getAccessToken();
  }

  setToken(token, persist = false) {
    if (persist) {
      localStorage.setItem('seds_access_token', token);
    } else {
      sessionStorage.setItem('seds_access_token', token);
    }
  }

  removeToken() {
    this.clearTokens();
  }

  // Build full URL
  buildURL(endpoint) {
    // If endpoint already includes the base URL, return as is
    if (endpoint.startsWith('http')) {
      return endpoint;
    }
    // Remove leading slash if present to avoid double slashes
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${this.baseURL}/${cleanEndpoint}`;
  }

  // Build headers with authentication
  buildHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    const accessToken = this.getAccessToken();
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    return headers;
  }

  // Refresh access token using refresh token
  async refreshAccessToken() {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${this.baseURL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      
      if (data.success && data.data?.accessToken) {
        // Update access token (keep same storage preference)
        const persist = !!localStorage.getItem('seds_access_token');
        if (persist) {
          localStorage.setItem('seds_access_token', data.data.accessToken);
        } else {
          sessionStorage.setItem('seds_access_token', data.data.accessToken);
        }
        return data.data.accessToken;
      }

      throw new Error('Invalid refresh response');
    } catch (error) {
      // If refresh fails, clear tokens and redirect to login
      this.clearTokens();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      throw error;
    }
  }

  // Handle response
  async handleResponse(response) {
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');

    let data;
    if (isJson) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      // Handle different error scenarios
      const error = {
        message: data.message || data.error || `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
        data: data,
      };

      // Handle 401 Unauthorized - token expired or invalid
      if (response.status === 401) {
        // Try to refresh token if we have a refresh token
        const refreshToken = this.getRefreshToken();
        if (refreshToken && !response.url.includes('/auth/refresh')) {
          try {
            await this.refreshAccessToken();
            // Retry the original request with new token
            // Note: This is a simple retry - for production, consider a retry queue
            return null; // Return null to indicate retry needed
          } catch (refreshError) {
            // Refresh failed, clear tokens and redirect
            this.clearTokens();
            if (window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
          }
        } else {
          // No refresh token or refresh endpoint, clear and redirect
          this.clearTokens();
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
      }

      throw error;
    }

    return data;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const {
      method = 'GET',
      body = null,
      headers: customHeaders = {},
      timeout = this.timeout,
      ...fetchOptions
    } = options;

    const url = this.buildURL(endpoint);
    const headers = this.buildHeaders(customHeaders);

    const config = {
      method,
      headers,
      ...fetchOptions,
    };

    if (body && method !== 'GET') {
      if (body instanceof FormData) {
        // Don't set Content-Type for FormData, browser will set it with boundary
        delete config.headers['Content-Type'];
        config.body = body;
      } else if (typeof body === 'object' && !(body instanceof FormData)) {
        config.body = JSON.stringify(body);
      } else {
        config.body = body;
      }
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    config.signal = controller.signal;

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);
      return await this.handleResponse(response);
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw {
          message: 'Request timeout. Please try again.',
          status: 408,
        };
      }

      // Network error or other fetch errors
      throw {
        message: error.message || 'Network error. Please check your connection.',
        status: 0,
        originalError: error,
      };
    }
  }

  // Convenience methods
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  async post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  }

  async put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  }

  async patch(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PATCH', body });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;

