// API Service Usage Examples

// ==================== Authentication Example ====================
import { authAPI } from './services/api';

// Login example
async function loginExample() {
    try {
        const response = await authAPI.login({
            email: 'admin@blockchain.com',
            password: 'admin123'
        });

        // Store token
        localStorage.setItem('authToken', response.data.token);

        // Store user data
        localStorage.setItem('user', JSON.stringify(response.data.user));

        console.log('Logged in:', response.data.user);
    } catch (error) {
        console.error('Login failed:', error);
    }
}

// Logout example
async function logoutExample() {
    try {
        await authAPI.logout();
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    } catch (error) {
        console.error('Logout failed:', error);
    }
}

// ==================== Wallet Holder Examples ====================
import { walletHolderAPI } from './services/api';

// Get all wallet holders
async function getWalletHolders() {
    try {
        const response = await walletHolderAPI.getAll();
        console.log('Wallet holders:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch wallet holders:', error);
        throw error;
    }
}

// Create new wallet holder
async function createWalletHolder() {
    try {
        const newHolder = {
            name: 'John Doe',
            email: 'john@example.com',
            walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595445678'
        };

        const response = await walletHolderAPI.create(newHolder);
        console.log('Created wallet holder:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to create wallet holder:', error);
        throw error;
    }
}

// Update wallet holder
async function updateWalletHolder(id) {
    try {
        const updates = {
            name: 'John Doe Updated',
            status: 'inactive'
        };

        const response = await walletHolderAPI.update(id, updates);
        console.log('Updated wallet holder:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to update wallet holder:', error);
        throw error;
    }
}

// Delete wallet holder
async function deleteWalletHolder(id) {
    try {
        await walletHolderAPI.delete(id);
        console.log('Deleted wallet holder:', id);
    } catch (error) {
        console.error('Failed to delete wallet holder:', error);
        throw error;
    }
}

// ==================== Wallet Examples ====================
import { walletAPI } from './services/api';

// Get all wallets with filtering
async function getWallets() {
    try {
        const response = await walletAPI.getAll({
            network: 'Ethereum',
            status: 'active'
        });
        console.log('Wallets:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch wallets:', error);
        throw error;
    }
}

// Create new wallet
async function createWallet() {
    try {
        const newWallet = {
            walletAddress: '0x' + Math.random().toString(16).substr(2, 40),
            owner: 'Alice Johnson',
            network: 'Ethereum',
            type: 'Hot Wallet',
            balance: 0
        };

        const response = await walletAPI.create(newWallet);
        console.log('Created wallet:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to create wallet:', error);
        throw error;
    }
}

// ==================== Transaction Examples ====================
import { transactionAPI } from './services/api';

// Get all transactions
async function getTransactions() {
    try {
        const response = await transactionAPI.getAll({
            type: 'transfer',
            status: 'confirmed'
        });
        console.log('Transactions:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch transactions:', error);
        throw error;
    }
}

// Get transaction by hash
async function getTransactionByHash(hash) {
    try {
        const response = await transactionAPI.getByHash(hash);
        console.log('Transaction:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch transaction:', error);
        throw error;
    }
}

// ==================== Analytics Examples ====================
import { analyticsAPI } from './services/api';

// Get dashboard statistics
async function getDashboardStats() {
    try {
        const response = await analyticsAPI.getStats();
        console.log('Dashboard stats:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch stats:', error);
        throw error;
    }
}

// Get volume data
async function getVolumeData() {
    try {
        const response = await analyticsAPI.getVolumeData('6months');
        console.log('Volume data:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch volume data:', error);
        throw error;
    }
}

// Get top wallets
async function getTopWallets() {
    try {
        const response = await analyticsAPI.getTopWallets(10);
        console.log('Top wallets:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch top wallets:', error);
        throw error;
    }
}

// ==================== Component Integration Example ====================

// Example React component using the API service
import { useEffect, useState } from 'react';
import { walletHolderAPI } from './services/api';

export function WalletHoldersList() {
    const [holders, setHolders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadHolders();
    }, []);

    const loadHolders = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await walletHolderAPI.getAll();
            setHolders(response.data);
        } catch (err) {
            setError(err.message);
            console.error('Error loading wallet holders:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;

        try {
            await walletHolderAPI.delete(id);
            // Reload the list after deletion
            await loadHolders();
        } catch (err) {
            alert('Failed to delete: ' + err.message);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Wallet Holders</h2>
            <ul>
                {holders.map(holder => (
                    <li key={holder.id}>
                        {holder.name} - {holder.email}
                        <button onClick={() => handleDelete(holder.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// ==================== Switching to Real API ====================

/*
  TO SWITCH FROM MOCK TO REAL API:
  
  1. In src/services/api.js, change:
     const USE_MOCK_DATA = false;
  
  2. Update .env with your real API URL:
     VITE_API_BASE_URL=https://your-real-api.com/api
  
  3. Ensure your backend endpoints match:
     - POST /api/auth/login
     - POST /api/auth/logout
     - GET /api/wallet-holders
     - POST /api/wallet-holders
     - PUT /api/wallet-holders/:id
     - DELETE /api/wallet-holders/:id
     - GET /api/wallets
     - GET /api/transactions
     - GET /api/analytics/stats
     - etc.
  
  4. Test each endpoint to ensure compatibility
*/
