# API Integration Guide

## Overview
This project uses a centralized API service layer for all backend communication. The API is designed to work with mock data during development and can be easily switched to real API endpoints when ready.

## Configuration

### Environment Variables
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the values in `.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   VITE_API_TIMEOUT=10000
   VITE_APP_ENV=development
   ```

## API Service Structure

### Location
`src/services/api.js`

### Features
- ✅ Centralized axios instance with interceptors
- ✅ Automatic JWT token handling
- ✅ Mock data support for development
- ✅ Global error handling
- ✅ Request/Response interceptors
- ✅ Easy switching between mock and real APIs

### Available APIs

#### 1. Authentication (`authAPI`)
```javascript
import { authAPI } from '@/services/api';

// Login
const response = await authAPI.login({ email, password });

// Logout
await authAPI.logout();

// Refresh token
await authAPI.refreshToken();
```

#### 2. Wallet Holders (`walletHolderAPI`)
```javascript
import { walletHolderAPI } from '@/services/api';

// Get all wallet holders
const response = await walletHolderAPI.getAll();

// Get by ID
const holder = await walletHolderAPI.getById(1);

// Create
const newHolder = await walletHolderAPI.create({ name, email, walletAddress });

// Update
await walletHolderAPI.update(id, { name, email });

// Delete
await walletHolderAPI.delete(id);
```

#### 3. Wallets (`walletAPI`)
```javascript
import { walletAPI } from '@/services/api';

// Get all wallets
const response = await walletAPI.getAll();

// Get by ID
const wallet = await walletAPI.getById(1);

// Create
const newWallet = await walletAPI.create({ walletAddress, owner, network });

// Update
await walletAPI.update(id, { status, balance });

// Delete
await walletAPI.delete(id);
```

#### 4. Transactions (`transactionAPI`)
```javascript
import { transactionAPI } from '@/services/api';

// Get all transactions
const response = await transactionAPI.getAll();

// Get by hash
const tx = await transactionAPI.getByHash('0x...');
```

#### 5. Analytics (`analyticsAPI`)
```javascript
import { analyticsAPI } from '@/services/api';

// Get stats
const stats = await analyticsAPI.getStats();

// Get volume data
const volumeData = await analyticsAPI.getVolumeData('6months');

// Get top wallets
const topWallets = await analyticsAPI.getTopWallets(5);

// Get recent transactions
const recent = await analyticsAPI.getRecentTransactions(10);
```

## Switching from Mock to Real API

### Step 1: Update the Mock Flag
In `src/services/api.js`, change:
```javascript
const USE_MOCK_DATA = false; // Change from true to false
```

### Step 2: Update API Base URL
In `.env`, update to your real API:
```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

### Step 3: Verify Endpoints
Ensure your backend API endpoints match the structure in the API service:
- `POST /auth/login`
- `POST /auth/logout`
- `GET /wallet-holders`
- `POST /wallet-holders`
- `GET /wallets`
- `GET /transactions`
- `GET /analytics/stats`
- etc.

## Authentication Flow

### Token Storage
- JWT tokens are stored in `localStorage` with key `authToken`
- User data is stored with key `user`

### Auto Token Injection
The axios interceptor automatically adds the token to all requests:
```javascript
Authorization: Bearer <token>
```

### Auto Logout on 401
If any API returns 401 Unauthorized, the app automatically:
1. Clears the auth token
2. Clears user data
3. Redirects to login page

## Error Handling

### Global Error Handler
All API errors are caught by the response interceptor. You can customize error handling in `api.js`.

### Component-Level Handling
```javascript
try {
  const response = await walletAPI.getAll();
  // Handle success
} catch (error) {
  console.error('Error fetching wallets:', error);
  // Handle error
}
```

## Example Usage in Components

```javascript
import { useEffect, useState } from 'react';
import { walletHolderAPI } from '@/services/api';

const MyComponent = () => {
  const [holders, setHolders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadHolders();
  }, []);

  const loadHolders = async () => {
    try {
      setLoading(true);
      const response = await walletHolderAPI.getAll();
      setHolders(response.data);
    } catch (error) {
      console.error('Failed to load holders:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Your component JSX
  );
};
```

## Best Practices

1. **Always use try-catch blocks** when calling APIs
2. **Show loading states** during API calls
3. **Handle errors gracefully** with user-friendly messages
4. **Don't store sensitive data** in environment variables that get bundled
5. **Use the centralized API service** - don't make direct axios calls
6. **Keep mock data realistic** to match real API responses
7. **Test with mock data first** before switching to real API

## Adding New API Endpoints

1. Add the new API function in `src/services/api.js`:
```javascript
export const newAPI = {
  getData: async () => {
    if (USE_MOCK_DATA) {
      await mockDelay();
      return { data: [...] };
    }
    return apiClient.get('/new-endpoint');
  },
};
```

2. Import and use in your component:
```javascript
import { newAPI } from '@/services/api';
const response = await newAPI.getData();
```

## Security Notes

- ❌ Never commit `.env` file (it's in `.gitignore`)
- ✅ Always use `.env.example` for documentation
- ✅ Tokens are stored in localStorage (consider using httpOnly cookies for production)
- ✅ API automatically handles 401 responses
- ✅ All requests include Authorization header when token exists
