import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 10000;

// Create axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add auth token if available
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized - redirect to login
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

// ==================== Authentication APIs ====================

export const authAPI = {
    // Login
    login: (credentials) => apiClient.post('/admin/login', credentials),

    // Logout
    logout: () => apiClient.post('/auth/logout'),

    // Refresh token
    refreshToken: () => apiClient.post('/auth/refresh'),
};

// ==================== Wallet Holder APIs ====================

export const walletHolderAPI = {
    // Get all card holders
    getCardHolders: (params = {}) => apiClient.get('/admin/card-holder-list', { params }),

    // Get single wallet holder
    getById: (id) => apiClient.get(`/wallet-holders/${id}`),

    // Create wallet holder
    create: (data) => apiClient.post('/wallet-holders', data),

    // Update wallet holder
    update: (id, data) => apiClient.put(`/wallet-holders/${id}`, data),

    // Delete wallet holder
    delete: (id) => apiClient.delete(`/wallet-holders/${id}`),
};

// ==================== Wallet APIs ====================

export const walletAPI = {
    // Get all wallets
    getAll: (params = {}) => apiClient.get('/wallets', { params }),

    // Get all card requests
    getCardRequests: (params = {}) => apiClient.get('/admin/card-request-list', { params }),

    // Approve card request and assign card number
    approveCardRequest: (data) => apiClient.post('/admin/approveCardRequest', data),

    // Get single wallet
    getById: (id) => apiClient.get(`/wallets/${id}`),

    // Create wallet
    create: (data) => apiClient.post('/wallets', data),

    // Update wallet
    update: (id, data) => apiClient.put(`/wallets/${id}`, data),

    // Delete wallet
    delete: (id) => apiClient.delete(`/wallets/${id}`),
};

// ==================== Transaction APIs ====================

export const transactionAPI = {
    // Get all transactions
    getAll: (params = {}) => apiClient.get('/transactions', { params }),

    // Get transaction by hash
    getByHash: (txHash) => apiClient.get(`/transactions/${txHash}`),
};

// ==================== Card Type APIs ====================

export const cardTypeAPI = {
    // Get card info list
    getCardInfoList: (params = {}) => apiClient.get('/admin/cardInfoList', { params }),

    // Create card info
    createCardInfo: (data) => apiClient.post('/admin/createCardInfo', data),
};

// ==================== Analytics APIs ====================

export const analyticsAPI = {
    // Get dashboard stats
    getStats: () => apiClient.get('/analytics/stats'),

    // Get volume data
    getVolumeData: (period = '6months') => apiClient.get('/analytics/volume', { params: { period } }),

    // Get top wallets
    getTopWallets: (limit = 5) => apiClient.get('/analytics/top-wallets', { params: { limit } }),

    // Get recent transactions
    getRecentTransactions: (limit = 10) => apiClient.get('/analytics/recent-transactions', { params: { limit } }),
};

export default apiClient;
