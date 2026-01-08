import { useState, useEffect } from 'react';
import { FiEdit2, FiSearch, FiTrash2 } from 'react-icons/fi';
import { walletAPI } from '../services/api';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import './DataTable.css';

const CardTable = () => {
    const [cardRequests, setCardRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCardRequests();
    }, []);

    const fetchCardRequests = async () => {
        try {
            setIsLoading(true);
            const response = await walletAPI.getCardRequests();
            // The API returns data in response.data.reqList
            const data = response.data.reqList || [];
            setCardRequests(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch card requests');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const filteredRequests = cardRequests.filter(req => {
        const holderName = `${req.cardHolder?.firstName || ''} ${req.cardHolder?.lastName || ''}`.toLowerCase();
        const matchesSearch = req.merchantOrderNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            holderName.includes(searchTerm.toLowerCase()) ||
            req.cardHolder?.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#8b5cf6',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Yes, remove it!',
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)'
        }).then((result) => {
            if (result.isConfirmed) {
                setCardRequests(cardRequests.filter(req => req._id !== id));
                toast.success('Request removed successfully');
            }
        });
    };

    const handleVerify = async (req) => {
        try {
            const result = await Swal.fire({
                title: 'Verify Request?',
                text: "This will process the request.",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#8b5cf6',
                cancelButtonColor: '#ef4444',
                confirmButtonText: 'Yes, verify it!',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)'
            });

            if (!result.isConfirmed) return;

            setIsLoading(true);
            await walletAPI.approveCardRequest({
                cardRequestId: req._id
            });

            await fetchCardRequests();
            toast.success('Request verified successfully!');
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to verify request');
        } finally {
            setIsLoading(false);
        }
    };



    const getStatusBadge = (status) => {
        const statusMap = {
            'APPROVED': 'success',
            'PENDING': 'warning',
            'REJECTED': 'danger',
            'PROCESSING': 'info',
            'ACTIVE': 'success',
            'INACTIVE': 'danger'
        };
        return statusMap[status?.toUpperCase()] || 'info';
    };



    return (
        <div className="data-table-container">
            {/* Header Actions */}
            <div className="table-actions glass">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search by order or holder..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <span className="search-icon"><FiSearch /></span>
                </div>

                <div className="filter-actions">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                    </select>

                    {/* <button className="btn-primary" onClick={() => setShowAddModal(true)}>
                        + New Request
                    </button> */}
                </div>
            </div>

            {/* Wallets Table */}
            <div className="table-wrapper glass fade-in">
                <div className="table-scroll">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Order No</th>
                                <th>Holder Name</th>
                                <th>Email</th>
                                <th>Amount</th>
                                <th>Card Number</th>
                                <th>Status</th>
                                <th>Request Status</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan="9" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
                            ) : error ? (
                                <tr><td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: 'var(--error)' }}>{error}</td></tr>
                            ) : filteredRequests.map((req) => (
                                <tr key={req._id}>
                                    <td>
                                        <span className="id-badge" title={req._id}>
                                            {req._id.slice(-6)}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="wallet-address" title={req.merchantOrderNo}>
                                            {req.merchantOrderNo.slice(0, 10)}...
                                        </span>
                                    </td>
                                    <td>{req.cardHolder?.firstName} {req.cardHolder?.lastName}</td>
                                    <td>{req.cardHolder?.email}</td>
                                    <td>
                                        <span className="price-tag">${req.amount}</span>
                                    </td>
                                    <td>
                                        <span className="wallet-address" title={req.cardId}>
                                            {req.cardId ? `${req.cardId.slice(0, 10)}...` : 'N/A'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge badge-${getStatusBadge(req.status)}`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge badge-${getStatusBadge(req.cardStatus)}`}>
                                            {req.cardStatus}
                                        </span>
                                    </td>
                                    <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div className="action-buttons">

                                            {req.status === "PENDING" && (
                                                <button
                                                    className="btn-verify"
                                                    onClick={() => handleVerify(req)}
                                                    title="Verify Request"
                                                >
                                                    Verify
                                                </button>
                                            )}
                                            {/* <button className="action-btn edit" title="Edit Request"><FiEdit2 /></button> */}
                                            {/* <button className="action-btn delete" onClick={() => handleDelete(req._id)} title="Remove Request"><FiTrash2 /></button> */}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredRequests.length === 0 && (
                        <div className="empty-state">
                            <p>No card requests found matching your search criteria</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Footer */}
            <div className="table-stats glass">
                <div className="stat-item">
                    <span className="stat-label">Total Requests:</span>
                    <span className="stat-value">{cardRequests.length}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Approved:</span>
                    <span className="stat-value">{cardRequests.filter(r => r.status === 'APPROVED').length}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Total Amount:</span>
                    <span className="stat-value">${cardRequests.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Showing:</span>
                    <span className="stat-value">{filteredRequests.length}</span>
                </div>
            </div>

            {/* Add Wallet Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal-content glass-strong" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>New Card Request</h3>
                            <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
                        </div>
                        <form className="modal-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Holder ID</label>
                                    <input type="text" placeholder="e.g., 155317" />
                                </div>
                                <div className="form-group">
                                    <label>Amount</label>
                                    <input type="number" placeholder="e.g., 20" />
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Create Request</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default CardTable;
