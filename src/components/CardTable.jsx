import { useState } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import './DataTable.css';

const CardTable = () => {
    const [wallets, setWallets] = useState([
        { id: 1, walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e75', owner: 'Alice Johnson', network: 'Ethereum', balance: 12.5, type: 'Hot Wallet', status: 'active', created: '2024-01-15' },
        { id: 2, walletAddress: '0x8c9e2b1dF3421Aa8976Bc54e7D890123', owner: 'Bob Smith', network: 'Ethereum', balance: 8.3, type: 'Hot Wallet', status: 'active', created: '2024-02-20' },
        { id: 3, walletAddress: '0x5a3f7e6c8d9A12Bc3456Def7890Ab123', owner: 'Charlie Davis', network: 'Polygon', balance: 45.7, type: 'Cold Wallet', status: 'active', created: '2023-12-10' },
        { id: 4, walletAddress: '0x1d2e9a4bC567890Def1234Abc5678901', owner: 'Diana Prince', network: 'BSC', balance: 5.2, type: 'Hot Wallet', status: 'active', created: '2024-03-05' },
        { id: 5, walletAddress: '0x6f8a5c3dE789012Abc345Def67890123', owner: 'Ethan Hunt', network: 'Ethereum', balance: 0.8, type: 'Hot Wallet', status: 'locked', created: '2024-01-22' },
        { id: 6, walletAddress: '0x9b7c4d2aF123456Bcd789012Def34567', owner: 'Fiona Gallagher', network: 'Arbitrum', balance: 23.4, type: 'Hot Wallet', status: 'active', created: '2024-04-12' },
        { id: 7, walletAddress: '0x3e5f6a8bC234567Cde890123Abc45678', owner: 'George Wilson', network: 'Ethereum', balance: 67.9, type: 'Cold Wallet', status: 'active', created: '2023-11-08' },
        { id: 8, walletAddress: '0x2d4e7f9aC345678Def901234Bcd56789', owner: 'Hannah Montana', network: 'Optimism', balance: 11.6, type: 'Hot Wallet', status: 'active', created: '2024-05-18' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterNetwork, setFilterNetwork] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);

    const filteredWallets = wallets.filter(wallet => {
        const matchesSearch = wallet.walletAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
            wallet.owner.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesNetwork = filterNetwork === 'all' || wallet.network === filterNetwork;
        const matchesStatus = filterStatus === 'all' || wallet.status === filterStatus;
        return matchesSearch && matchesNetwork && matchesStatus;
    });

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to remove this wallet?')) {
            setWallets(wallets.filter(wallet => wallet.id !== id));
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'active': 'success',
            'locked': 'warning',
            'suspended': 'danger'
        };
        return statusMap[status] || 'info';
    };

    const getNetworkIcon = (network) => {
        const iconMap = {
            'Ethereum': '⟠',
            'Polygon': '🟣',
            'BSC': '🟡',
            'Arbitrum': '🔵',
            'Optimism': '🔴',
        };
        return iconMap[network] || '⛓️';
    };

    return (
        <div className="data-table-container">
            {/* Header Actions */}
            <div className="table-actions glass">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search wallets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <span className="search-icon">🔍</span>
                </div>

                <div className="filter-actions">
                    <select
                        value={filterNetwork}
                        onChange={(e) => setFilterNetwork(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Networks</option>
                        <option value="Ethereum">Ethereum</option>
                        <option value="Polygon">Polygon</option>
                        <option value="BSC">BSC</option>
                        <option value="Arbitrum">Arbitrum</option>
                        <option value="Optimism">Optimism</option>
                    </select>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="locked">Locked</option>
                        <option value="suspended">Suspended</option>
                    </select>

                    <button className="btn-primary" onClick={() => setShowAddModal(true)}>
                        + Add Wallet
                    </button>
                </div>
            </div>

            {/* Wallets Table */}
            <div className="table-wrapper glass fade-in">
                <div className="table-scroll">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Wallet Address</th>
                                <th>Owner</th>
                                <th>Network</th>
                                <th>Type</th>
                                <th>Balance</th>
                                <th>Created</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredWallets.map((wallet) => (
                                <tr key={wallet.id}>
                                    <td>#{wallet.id}</td>
                                    <td>
                                        <div className="car-cell">
                                            <div className="car-icon">{getNetworkIcon(wallet.network)}</div>
                                            <span className="wallet-address" title={wallet.walletAddress}>
                                                {wallet.walletAddress.slice(0, 6)}...{wallet.walletAddress.slice(-4)}
                                            </span>
                                        </div>
                                    </td>
                                    <td>{wallet.owner}</td>
                                    <td>
                                        <span className="category-badge">{wallet.network}</span>
                                    </td>
                                    <td>{wallet.type}</td>
                                    <td>
                                        <span className="price-tag">{wallet.balance.toFixed(2)} ETH</span>
                                    </td>
                                    <td>{wallet.created}</td>
                                    <td>
                                        <span className={`badge badge-${getStatusBadge(wallet.status)}`}>
                                            {wallet.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="action-btn edit" title="Edit Wallet"><FiEdit2 /></button>
                                            <button className="action-btn delete" onClick={() => handleDelete(wallet.id)} title="Remove Wallet"><FiTrash2 /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredWallets.length === 0 && (
                        <div className="empty-state">
                            <p>No wallets found matching your search criteria</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Footer */}
            <div className="table-stats glass">
                <div className="stat-item">
                    <span className="stat-label">Total Wallets:</span>
                    <span className="stat-value">{wallets.length}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Active:</span>
                    <span className="stat-value">{wallets.filter(w => w.status === 'active').length}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Total Balance:</span>
                    <span className="stat-value">{wallets.reduce((sum, w) => sum + w.balance, 0).toFixed(2)} ETH</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Showing:</span>
                    <span className="stat-value">{filteredWallets.length}</span>
                </div>
            </div>

            {/* Add Wallet Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal-content glass-strong" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Add New Wallet</h3>
                            <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
                        </div>
                        <form className="modal-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Wallet Address</label>
                                    <input type="text" placeholder="0x..." />
                                </div>
                                <div className="form-group">
                                    <label>Owner Name</label>
                                    <input type="text" placeholder="e.g., John Doe" />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Network</label>
                                    <select>
                                        <option>Ethereum</option>
                                        <option>Polygon</option>
                                        <option>BSC</option>
                                        <option>Arbitrum</option>
                                        <option>Optimism</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Wallet Type</label>
                                    <select>
                                        <option>Hot Wallet</option>
                                        <option>Cold Wallet</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Add Wallet</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CardTable;
