import { useState } from 'react';
import './DataTable.css';

const TransactionsTable = () => {
    const [transactions, setTransactions] = useState([
        { id: 1, txHash: '0xa1b2c3d4e5f6789012345678901234567890abcd', from: '0x742d...5678', to: '0x8c9e...0123', amount: 2.5, gasUsed: 21000, gasFee: 0.00084, blockNumber: 18234567, type: 'transfer', status: 'confirmed', timestamp: '2025-12-26 10:30:45' },
        { id: 2, txHash: '0xb2c3d4e5f67890123456789012345678901abcde', from: '0x5a3f...Ab123', to: '0x1d2e...8901', amount: 0.75, gasUsed: 21000, gasFee: 0.00063, blockNumber: 18234566, type: 'transfer', status: 'confirmed', timestamp: '2025-12-26 09:15:22' },
        { id: 3, txHash: '0xc3d4e5f678901234567890123456789012abcdef', from: '0x6f8a...0123', to: '0x742d...5678', amount: 1.2, gasUsed: 45000, gasFee: 0.00135, blockNumber: 18234565, type: 'contract', status: 'pending', timestamp: '2025-12-26 08:45:10' },
        { id: 4, txHash: '0xd4e5f6789012345678901234567890123abcdefg', from: '0x8c9e...0123', to: '0x5a3f...Ab123', amount: 3.8, gasUsed: 21000, gasFee: 0.00084, blockNumber: 18234564, type: 'transfer', status: 'confirmed', timestamp: '2025-12-25 11:20:33' },
        { id: 5, txHash: '0xe5f67890123456789012345678901234abcdefgh', from: '0x9b7c...4567', to: '0x3e5f...5678', amount: 0.5, gasUsed: 65000, gasFee: 0.00195, blockNumber: 18234563, type: 'swap', status: 'confirmed', timestamp: '2025-12-25 10:05:18' },
        { id: 6, txHash: '0xf678901234567890123456789012345abcdefghi', from: '0x2d4e...6789', to: '0x742d...5678', amount: 5.0, gasUsed: 21000, gasFee: 0.00084, blockNumber: 18234562, type: 'transfer', status: 'confirmed', timestamp: '2025-12-25 09:30:55' },
        { id: 7, txHash: '0x6789012345678901234567890123456abcdefghij', from: '0x5a3f...Ab123', to: '0x8c9e...0123', amount: 0.3, gasUsed: 21000, gasFee: 0.00063, blockNumber: 18234561, type: 'transfer', status: 'failed', timestamp: '2025-12-24 08:15:40' },
        { id: 8, txHash: '0x789012345678901234567890123456789abcdefgh', from: '0x1d2e...8901', to: '0x6f8a...0123', amount: 10.5, gasUsed: 21000, gasFee: 0.00084, blockNumber: 18234560, type: 'transfer', status: 'confirmed', timestamp: '2025-12-24 07:45:12' },
        { id: 9, txHash: '0x89012345678901234567890123456789abcdefghi', from: '0x3e5f...5678', to: '0x9b7c...4567', amount: 1.8, gasUsed: 52000, gasFee: 0.00156, blockNumber: 18234559, type: 'contract', status: 'confirmed', timestamp: '2025-12-23 06:20:28' },
        { id: 10, txHash: '0x9012345678901234567890123456789abcdefghij', from: '0x742d...5678', to: '0x2d4e...6789', amount: 7.2, gasUsed: 21000, gasFee: 0.00084, blockNumber: 18234558, type: 'transfer', status: 'confirmed', timestamp: '2025-12-23 05:10:05' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    const filteredTransactions = transactions.filter(txn => {
        const matchesSearch = txn.txHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
            txn.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
            txn.to.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || txn.type === filterType;
        const matchesStatus = filterStatus === 'all' || txn.status === filterStatus;
        return matchesSearch && matchesType && matchesStatus;
    });

    const getStatusBadge = (status) => {
        const statusMap = {
            'confirmed': 'success',
            'pending': 'warning',
            'failed': 'danger'
        };
        return statusMap[status] || 'info';
    };

    const getTypeIcon = (type) => {
        const iconMap = {
            'transfer': '↔️',
            'swap': '🔄',
            'contract': '📜',
            'mint': '🪙',
            'burn': '🔥'
        };
        return iconMap[type] || '💳';
    };

    const getTotalVolume = () => {
        return transactions
            .filter(txn => txn.status === 'confirmed')
            .reduce((sum, txn) => sum + txn.amount, 0);
    };

    const getTotalGasFees = () => {
        return transactions
            .filter(txn => txn.status === 'confirmed')
            .reduce((sum, txn) => sum + txn.gasFee, 0);
    };

    return (
        <div className="data-table-container">
            {/* Header Actions */}
            <div className="table-actions glass">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search by hash or address..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <span className="search-icon">🔍</span>
                </div>

                <div className="filter-actions">
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Types</option>
                        <option value="transfer">Transfer</option>
                        <option value="swap">Swap</option>
                        <option value="contract">Contract</option>
                        <option value="mint">Mint</option>
                        <option value="burn">Burn</option>
                    </select>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Status</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                    </select>

                    <button className="btn-primary">
                        📥 Export
                    </button>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="table-wrapper glass fade-in">
                <div className="table-scroll">
                    <table>
                        <thead>
                            <tr>
                                <th>Block</th>
                                <th>Transaction Hash</th>
                                <th>From</th>
                                <th>To</th>
                                <th>Type</th>
                                <th>Amount (ETH)</th>
                                <th>Gas Fee</th>
                                <th>Timestamp</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map((txn) => (
                                <tr key={txn.id}>
                                    <td>
                                        <span className="booking-count">#{txn.blockNumber}</span>
                                    </td>
                                    <td>
                                        <span className="wallet-address" title={txn.txHash}>
                                            {txn.txHash.slice(0, 10)}...{txn.txHash.slice(-8)}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="wallet-address" title={txn.from}>
                                            {txn.from}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="wallet-address" title={txn.to}>
                                            {txn.to}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span>{getTypeIcon(txn.type)}</span>
                                            <span style={{ textTransform: 'capitalize' }}>{txn.type}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="total-amount">{txn.amount.toFixed(4)} ETH</span>
                                    </td>
                                    <td>
                                        <span className="gas-fee">{txn.gasFee.toFixed(5)} ETH</span>
                                    </td>
                                    <td>{txn.timestamp}</td>
                                    <td>
                                        <span className={`badge badge-${getStatusBadge(txn.status)}`}>
                                            {txn.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredTransactions.length === 0 && (
                        <div className="empty-state">
                            <p>No transactions found matching your search criteria</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Footer */}
            <div className="table-stats glass">
                <div className="stat-item">
                    <span className="stat-label">Total Transactions:</span>
                    <span className="stat-value">{transactions.length}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Confirmed:</span>
                    <span className="stat-value">{transactions.filter(t => t.status === 'confirmed').length}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Pending:</span>
                    <span className="stat-value">{transactions.filter(t => t.status === 'pending').length}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Volume:</span>
                    <span className="stat-value">{getTotalVolume().toFixed(2)} ETH</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Total Gas Fees:</span>
                    <span className="stat-value">{getTotalGasFees().toFixed(5)} ETH</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Showing:</span>
                    <span className="stat-value">{filteredTransactions.length}</span>
                </div>
            </div>
        </div>
    );
};

export default TransactionsTable;
