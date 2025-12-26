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

// Mock data flag - set to false when real API is ready
const USE_MOCK_DATA = true;

// Helper function for mock delay
const mockDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// ==================== Authentication APIs ====================

export const authAPI = {
    // Login
    login: async (credentials) => {
        if (USE_MOCK_DATA) {
            await mockDelay();
            // Mock successful login
            if (credentials.email && credentials.password) {
                return {
                    data: {
                        user: {
                            id: 1,
                            email: credentials.email,
                            name: 'Admin User',
                            role: 'Super Admin',
                        },
                        token: 'mock-jwt-token-' + Date.now(),
                    },
                };
            }
            throw new Error('Invalid credentials');
        }
        return apiClient.post('/auth/login', credentials);
    },

    // Logout
    logout: async () => {
        if (USE_MOCK_DATA) {
            await mockDelay(200);
            return { data: { message: 'Logged out successfully' } };
        }
        return apiClient.post('/auth/logout');
    },

    // Refresh token
    refreshToken: async () => {
        if (USE_MOCK_DATA) {
            await mockDelay();
            return { data: { token: 'mock-refreshed-token-' + Date.now() } };
        }
        return apiClient.post('/auth/refresh');
    },
};

// ==================== Wallet Holder APIs ====================

export const walletHolderAPI = {
    // Get all wallet holders
    getAll: async (params = {}) => {
        if (USE_MOCK_DATA) {
            await mockDelay();
            return {
                data: [
                    { id: 1, name: 'Alice Johnson', walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595445678', email: 'alice@example.com', status: 'active', joined: '2024-01-15', totalTxns: 145, balance: 12.5 },
                    { id: 2, name: 'Bob Smith', walletAddress: '0x8c9e2b1dF3421Aa8976Bc54e7D8901234567890a', email: 'bob@example.com', status: 'active', joined: '2024-02-20', totalTxns: 89, balance: 8.3 },
                    { id: 3, name: 'Charlie Davis', walletAddress: '0x5a3f7e6c8d9A12Bc3456Def7890Ab1234567Cdef', email: 'charlie@example.com', status: 'active', joined: '2023-12-10', totalTxns: 234, balance: 45.7 },
                    { id: 4, name: 'Diana Prince', walletAddress: '0x1d2e9a4bC567890Def1234Abc567890123456789', email: 'diana@example.com', status: 'active', joined: '2024-03-05', totalTxns: 67, balance: 5.2 },
                    { id: 5, name: 'Ethan Hunt', walletAddress: '0x6f8a5c3dE789012Abc345Def678901234567Ab12', email: 'ethan@example.com', status: 'inactive', joined: '2024-01-22', totalTxns: 12, balance: 0.8 },
                    { id: 6, name: 'Fiona Gallagher', walletAddress: '0x9b7c4d2aF123456Bcd789012Def345678901Abcd', email: 'fiona@example.com', status: 'active', joined: '2024-04-12', totalTxns: 178, balance: 23.4 },
                    { id: 7, name: 'George Wilson', walletAddress: '0x3e5f6a8bC234567Cde890123Abc456789012Bcde', email: 'george@example.com', status: 'active', joined: '2023-11-08', totalTxns: 312, balance: 67.9 },
                    { id: 8, name: 'Hannah Montana', walletAddress: '0x2d4e7f9aC345678Def901234Bcd567890123Cdef', email: 'hannah@example.com', status: 'active', joined: '2024-05-18', totalTxns: 91, balance: 11.6 },
                ],
            };
        }
        return apiClient.get('/wallet-holders', { params });
    },

    // Get single wallet holder
    getById: async (id) => {
        if (USE_MOCK_DATA) {
            await mockDelay();
            return { data: { id, name: 'Alice Johnson', /* ... */ } };
        }
        return apiClient.get(`/wallet-holders/${id}`);
    },

    // Create wallet holder
    create: async (data) => {
        if (USE_MOCK_DATA) {
            await mockDelay();
            return { data: { id: Date.now(), ...data } };
        }
        return apiClient.post('/wallet-holders', data);
    },

    // Update wallet holder
    update: async (id, data) => {
        if (USE_MOCK_DATA) {
            await mockDelay();
            return { data: { id, ...data } };
        }
        return apiClient.put(`/wallet-holders/${id}`, data);
    },

    // Delete wallet holder
    delete: async (id) => {
        if (USE_MOCK_DATA) {
            await mockDelay();
            return { data: { message: 'Deleted successfully' } };
        }
        return apiClient.delete(`/wallet-holders/${id}`);
    },
};

// ==================== Wallet APIs ====================

export const walletAPI = {
    // Get all wallets
    getAll: async (params = {}) => {
        if (USE_MOCK_DATA) {
            await mockDelay();
            return {
                data: [
                    { id: 1, walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e75', owner: 'Alice Johnson', network: 'Ethereum', balance: 12.5, type: 'Hot Wallet', status: 'active', created: '2024-01-15' },
                    { id: 2, walletAddress: '0x8c9e2b1dF3421Aa8976Bc54e7D890123', owner: 'Bob Smith', network: 'Ethereum', balance: 8.3, type: 'Hot Wallet', status: 'active', created: '2024-02-20' },
                    { id: 3, walletAddress: '0x5a3f7e6c8d9A12Bc3456Def7890Ab123', owner: 'Charlie Davis', network: 'Polygon', balance: 45.7, type: 'Cold Wallet', status: 'active', created: '2023-12-10' },
                    { id: 4, walletAddress: '0x1d2e9a4bC567890Def1234Abc5678901', owner: 'Diana Prince', network: 'BSC', balance: 5.2, type: 'Hot Wallet', status: 'active', created: '2024-03-05' },
                    { id: 5, walletAddress: '0x6f8a5c3dE789012Abc345Def67890123', owner: 'Ethan Hunt', network: 'Ethereum', balance: 0.8, type: 'Hot Wallet', status: 'locked', created: '2024-01-22' },
                    { id: 6, walletAddress: '0x9b7c4d2aF123456Bcd789012Def34567', owner: 'Fiona Gallagher', network: 'Arbitrum', balance: 23.4, type: 'Hot Wallet', status: 'active', created: '2024-04-12' },
                    { id: 7, walletAddress: '0x3e5f6a8bC234567Cde890123Abc45678', owner: 'George Wilson', network: 'Ethereum', balance: 67.9, type: 'Cold Wallet', status: 'active', created: '2023-11-08' },
                    { id: 8, walletAddress: '0x2d4e7f9aC345678Def901234Bcd56789', owner: 'Hannah Montana', network: 'Optimism', balance: 11.6, type: 'Hot Wallet', status: 'active', created: '2024-05-18' },
                ],
            };
        }
        return apiClient.get('/wallets', { params });
    },

    // Get single wallet
    getById: async (id) => {
        if (USE_MOCK_DATA) {
            await mockDelay();
            return { data: { id, walletAddress: '0x742d...', /* ... */ } };
        }
        return apiClient.get(`/wallets/${id}`);
    },

    // Create wallet
    create: async (data) => {
        if (USE_MOCK_DATA) {
            await mockDelay();
            return { data: { id: Date.now(), ...data } };
        }
        return apiClient.post('/wallets', data);
    },

    // Update wallet
    update: async (id, data) => {
        if (USE_MOCK_DATA) {
            await mockDelay();
            return { data: { id, ...data } };
        }
        return apiClient.put(`/wallets/${id}`, data);
    },

    // Delete wallet
    delete: async (id) => {
        if (USE_MOCK_DATA) {
            await mockDelay();
            return { data: { message: 'Deleted successfully' } };
        }
        return apiClient.delete(`/wallets/${id}`);
    },
};

// ==================== Transaction APIs ====================

export const transactionAPI = {
    // Get all transactions
    getAll: async (params = {}) => {
        if (USE_MOCK_DATA) {
            await mockDelay();
            return {
                data: [
                    { id: 1, txHash: '0xa1b2c3d4e5f6789012345678901234567890abcd', from: '0x742d...5678', to: '0x8c9e...0123', amount: 2.5, gasUsed: 21000, gasFee: 0.00084, blockNumber: 18234567, type: 'transfer', status: 'confirmed', timestamp: '2025-12-26 10:30:45' },
                    { id: 2, txHash: '0xb2c3d4e5f67890123456789012345678901abcde', from: '0x5a3f...Ab123', to: '0x1d2e...8901', amount: 0.75, gasUsed: 21000, gasFee: 0.00063, blockNumber: 18234566, type: 'transfer', status: 'confirmed', timestamp: '2025-12-26 09:15:22' },
                    { id: 3, txHash: '0xc3d4e5f678901234567890123456789012abcdef', from: '0x6f8a...0123', to: '0x742d...5678', amount: 1.2, gasUsed: 45000, gasFee: 0.00135, blockNumber: 18234565, type: 'contract', status: 'pending', timestamp: '2025-12-26 08:45:10' },
                    { id: 4, txHash: '0xd4e5f6789012345678901234567890123abcdefg', from: '0x8c9e...0123', to: '0x5a3f...Ab123', amount: 3.8, gasUsed: 21000, gasFee: 0.00084, blockNumber: 18234564, type: 'transfer', status: 'confirmed', timestamp: '2025-12-25 11:20:33' },
                    { id: 5, txHash: '0xe5f67890123456789012345678901234abcdefgh', from: '0x9b7c...4567', to: '0x3e5f...5678', amount: 0.5, gasUsed: 65000, gasFee: 0.00195, blockNumber: 18234563, type: 'swap', status: 'confirmed', timestamp: '2025-12-25 10:05:18' },
                ],
            };
        }
        return apiClient.get('/transactions', { params });
    },

    // Get transaction by hash
    getByHash: async (txHash) => {
        if (USE_MOCK_DATA) {
            await mockDelay();
            return { data: { txHash, /* ... */ } };
        }
        return apiClient.get(`/transactions/${txHash}`);
    },
};

// ==================== Analytics APIs ====================

export const analyticsAPI = {
    // Get dashboard stats
    getStats: async () => {
        if (USE_MOCK_DATA) {
            await mockDelay();
            return {
                data: {
                    totalVolume: 12543.78,
                    totalTransactions: 8342,
                    activeWallets: 1256,
                    totalGasFees: 45.32,
                },
            };
        }
        return apiClient.get('/analytics/stats');
    },

    // Get volume data
    getVolumeData: async (period = '6months') => {
        if (USE_MOCK_DATA) {
            await mockDelay();
            return {
                data: [
                    { month: 'Jan', volume: 1250.5 },
                    { month: 'Feb', volume: 1580.8 },
                    { month: 'Mar', volume: 2120.3 },
                    { month: 'Apr', volume: 1890.6 },
                    { month: 'May', volume: 2540.2 },
                    { month: 'Jun', volume: 2161.4 },
                ],
            };
        }
        return apiClient.get('/analytics/volume', { params: { period } });
    },

    // Get top wallets
    getTopWallets: async (limit = 5) => {
        if (USE_MOCK_DATA) {
            await mockDelay();
            return {
                data: [
                    { address: '0x742d...3f8a', transactions: 145, volume: 2250.5 },
                    { address: '0x8c9e...2b1d', transactions: 128, volume: 1980.3 },
                    { address: '0x5a3f...7e6c', transactions: 112, volume: 1820.7 },
                    { address: '0x1d2e...9a4b', transactions: 98, volume: 1650.2 },
                    { address: '0x6f8a...5c3d', transactions: 85, volume: 1260.8 },
                ],
            };
        }
        return apiClient.get('/analytics/top-wallets', { params: { limit } });
    },

    // Get recent transactions
    getRecentTransactions: async (limit = 10) => {
        if (USE_MOCK_DATA) {
            await mockDelay();
            return {
                data: [
                    { id: 1, from: '0x742d...3f8a', to: '0x8c9e...2b1d', amount: 2.5, status: 'confirmed', blockNumber: 18234567 },
                    { id: 2, from: '0x5a3f...7e6c', to: '0x1d2e...9a4b', amount: 0.75, status: 'confirmed', blockNumber: 18234566 },
                    { id: 3, from: '0x6f8a...5c3d', to: '0x742d...3f8a', amount: 1.2, status: 'pending', blockNumber: 18234565 },
                    { id: 4, from: '0x8c9e...2b1d', to: '0x5a3f...7e6c', amount: 3.8, status: 'confirmed', blockNumber: 18234564 },
                ],
            };
        }
        return apiClient.get('/analytics/recent-transactions', { params: { limit } });
    },
};

export default apiClient;
