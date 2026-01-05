import { useState, useEffect } from 'react';
import { transactionAPI } from '../services/api';
import './DataTable.css';

const TransactionsTable = () => {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            setIsLoading(true);
            const response = await transactionAPI.getAll();
            // Handle both direct array response and nested data array (e.g., response.data.transactions)
            const data = response.data.transactions || (Array.isArray(response.data) ? response.data : (response.data.data || []));
            setTransactions(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch transactions');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

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
                            {isLoading ? (
                                <tr><td colSpan="9" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
                            ) : error ? (
                                <tr><td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: 'var(--error)' }}>{error}</td></tr>
                            ) : filteredTransactions.map((txn) => (
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
