import { useState } from 'react';
import './DataTable.css';

const CardHolderTable = () => {
    const [walletHolders, setWalletHolders] = useState([
        { id: 1, name: 'Alice Johnson', walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595445678', email: 'alice@example.com', status: 'active', joined: '2024-01-15', totalTxns: 145, balance: 12.5 },
        { id: 2, name: 'Bob Smith', walletAddress: '0x8c9e2b1dF3421Aa8976Bc54e7D8901234567890a', email: 'bob@example.com', status: 'active', joined: '2024-02-20', totalTxns: 89, balance: 8.3 },
        { id: 3, name: 'Charlie Davis', walletAddress: '0x5a3f7e6c8d9A12Bc3456Def7890Ab1234567Cdef', email: 'charlie@example.com', status: 'active', joined: '2023-12-10', totalTxns: 234, balance: 45.7 },
        { id: 4, name: 'Diana Prince', walletAddress: '0x1d2e9a4bC567890Def1234Abc567890123456789', email: 'diana@example.com', status: 'active', joined: '2024-03-05', totalTxns: 67, balance: 5.2 },
        { id: 5, name: 'Ethan Hunt', walletAddress: '0x6f8a5c3dE789012Abc345Def678901234567Ab12', email: 'ethan@example.com', status: 'inactive', joined: '2024-01-22', totalTxns: 12, balance: 0.8 },
        { id: 6, name: 'Fiona Gallagher', walletAddress: '0x9b7c4d2aF123456Bcd789012Def345678901Abcd', email: 'fiona@example.com', status: 'active', joined: '2024-04-12', totalTxns: 178, balance: 23.4 },
        { id: 7, name: 'George Wilson', walletAddress: '0x3e5f6a8bC234567Cde890123Abc456789012Bcde', email: 'george@example.com', status: 'active', joined: '2023-11-08', totalTxns: 312, balance: 67.9 },
        { id: 8, name: 'Hannah Montana', walletAddress: '0x2d4e7f9aC345678Def901234Bcd567890123Cdef', email: 'hannah@example.com', status: 'active', joined: '2024-05-18', totalTxns: 91, balance: 11.6 },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);

    const filteredWalletHolders = walletHolders.filter(holder => {
        const matchesSearch = holder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            holder.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            holder.walletAddress.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || holder.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to remove this wallet holder?')) {
            setWalletHolders(walletHolders.filter(holder => holder.id !== id));
        }
    };

    return (
        <div className="data-table-container">
            {/* Header Actions */}
            <div className="table-actions glass">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search wallet holders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <span className="search-icon">🔍</span>
                </div>

                <div className="filter-actions">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>

                    <button className="btn-primary" onClick={() => setShowAddModal(true)}>
                        + Add Wallet Holder
                    </button>
                </div>
            </div>

            {/* Wallet Holders Table */}
            <div className="table-wrapper glass fade-in">
                <div className="table-scroll">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Wallet Address</th>
                                <th>Email</th>
                                <th>Balance (ETH)</th>
                                <th>Total Txns</th>
                                <th>Status</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredWalletHolders.map((holder) => (
                                <tr key={holder.id}>
                                    <td>#{holder.id}</td>
                                    <td>
                                        <div className="user-cell">
                                            <div className="user-avatar">{holder.name.charAt(0)}</div>
                                            <span className="user-name">{holder.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="wallet-address" title={holder.walletAddress}>
                                            {holder.walletAddress.slice(0, 6)}...{holder.walletAddress.slice(-4)}
                                        </span>
                                    </td>
                                    <td>{holder.email}</td>
                                    <td>
                                        <span className="price-tag">{holder.balance.toFixed(2)} ETH</span>
                                    </td>
                                    <td>
                                        <span className="booking-count">{holder.totalTxns}</span>
                                    </td>
                                    <td>
                                        <span className={`badge badge-${holder.status === 'active' ? 'success' : 'warning'}`}>
                                            {holder.status}
                                        </span>
                                    </td>
                                    <td>{holder.joined}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="action-btn view" title="View Details">👁️</button>
                                            <button className="action-btn edit" title="Edit Wallet Holder">✏️</button>
                                            <button className="action-btn delete" onClick={() => handleDelete(holder.id)} title="Remove Wallet Holder">🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredWalletHolders.length === 0 && (
                        <div className="empty-state">
                            <p>No wallet holders found matching your search criteria</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Footer */}
            <div className="table-stats glass">
                <div className="stat-item">
                    <span className="stat-label">Total Holders:</span>
                    <span className="stat-value">{walletHolders.length}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Active:</span>
                    <span className="stat-value">{walletHolders.filter(h => h.status === 'active').length}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Total Balance:</span>
                    <span className="stat-value">{walletHolders.reduce((sum, h) => sum + h.balance, 0).toFixed(2)} ETH</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Showing:</span>
                    <span className="stat-value">{filteredWalletHolders.length}</span>
                </div>
            </div>

            {/* Add Wallet Holder Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal-content glass-strong" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Add New Wallet Holder</h3>
                            <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
                        </div>
                        <form className="modal-form">
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" placeholder="Enter wallet holder name" />
                            </div>
                            <div className="form-group">
                                <label>Wallet Address</label>
                                <input type="text" placeholder="0x..." />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" placeholder="Enter email address" />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Add Wallet Holder</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CardHolderTable;
