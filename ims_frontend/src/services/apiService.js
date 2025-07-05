import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://vscode-internal-3414-beta.beta01.cloud.kavia.ai:3001';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle auth errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // PUBLIC_INTERFACE
  setAuthToken(token) {
    if (token) {
      this.api.defaults.headers.Authorization = `Bearer ${token}`;
    } else {
      delete this.api.defaults.headers.Authorization;
    }
  }

  // PUBLIC_INTERFACE
  get(url, config = {}) {
    return this.api.get(url, config);
  }

  // PUBLIC_INTERFACE
  post(url, data, config = {}) {
    return this.api.post(url, data, config);
  }

  // PUBLIC_INTERFACE
  put(url, data, config = {}) {
    return this.api.put(url, data, config);
  }

  // PUBLIC_INTERFACE
  delete(url, config = {}) {
    return this.api.delete(url, config);
  }

  // Items API
  // PUBLIC_INTERFACE
  getItems() {
    return this.get('/api/items');
  }

  // PUBLIC_INTERFACE
  createItem(item) {
    return this.post('/api/items', item);
  }

  // PUBLIC_INTERFACE
  updateItem(id, item) {
    return this.put(`/api/items/${id}`, item);
  }

  // PUBLIC_INTERFACE
  deleteItem(id) {
    return this.delete(`/api/items/${id}`);
  }

  // Storerooms API
  // PUBLIC_INTERFACE
  getStorerooms() {
    return this.get('/api/storerooms');
  }

  // PUBLIC_INTERFACE
  createStoreroom(storeroom) {
    return this.post('/api/storerooms', storeroom);
  }

  // PUBLIC_INTERFACE
  updateStoreroom(id, storeroom) {
    return this.put(`/api/storerooms/${id}`, storeroom);
  }

  // PUBLIC_INTERFACE
  deleteStoreroom(id) {
    return this.delete(`/api/storerooms/${id}`);
  }

  // Transfers API
  // PUBLIC_INTERFACE
  getTransfers() {
    return this.get('/api/transfers');
  }

  // PUBLIC_INTERFACE
  createTransfer(transfer) {
    return this.post('/api/transfers', transfer);
  }

  // PUBLIC_INTERFACE
  getTransferHistory() {
    return this.get('/api/transfer-history');
  }

  // Dashboard API
  // PUBLIC_INTERFACE
  getDashboardData() {
    return this.get('/api/dashboard');
  }

  // Auth API
  // PUBLIC_INTERFACE
  login(credentials) {
    return this.post('/auth/login', credentials);
  }

  // PUBLIC_INTERFACE
  getCurrentUser() {
    return this.get('/auth/me');
  }
}

export const apiService = new ApiService();
