import { useState, useEffect } from 'react';
import { FiEdit2, FiSearch, FiTrash2, FiEye, FiX } from 'react-icons/fi';
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
    const [showViewModal, setShowViewModal] = useState(false);
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



    const handleViewClick = (req) => {
        setSelectedRequest(req);
        setShowViewModal(true);
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
                                {/* <th>Amount</th> */}
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
                                    {/* <td>
                                        <span className="price-tag">${req.amount}</span>
                                    </td> */}
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
                                            <button
                                                className="action-btn view"
                                                title="View Details"
                                                onClick={() => handleViewClick(req)}
                                            >
                                                <FiEye />
                                            </button>
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

            {/* View Details Modal */}
            {showViewModal && (
                <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
                    <div className="modal-content glass-strong" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Request Details</h3>
                            <button className="close-btn" onClick={() => setShowViewModal(false)}><FiX /></button>
                        </div>
                        <div className="details-content">
                            <div className="detail-section">
                                <h4>Request Information</h4>
                                <div className="detail-row">
                                    <span className="detail-label">Request ID</span>
                                    <span className="detail-value">{selectedRequest?._id}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Order Number</span>
                                    <span className="detail-value">{selectedRequest?.merchantOrderNo}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Amount</span>
                                    <span className="detail-value highlight">${selectedRequest?.amount}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Status</span>
                                    <span className={`badge badge-${getStatusBadge(selectedRequest?.status)}`}>
                                        {selectedRequest?.status}
                                    </span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Created At</span>
                                    <span className="detail-value">{new Date(selectedRequest?.createdAt).toLocaleString()}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Updated At</span>
                                    <span className="detail-value">{new Date(selectedRequest?.updatedAt).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h4>Card Information</h4>
                                <div className="detail-row">
                                    <span className="detail-label">Card Number (Full)</span>
                                    <span className="detail-value">{selectedRequest?.cardNo || 'Not Assigned'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Card ID</span>
                                    <span className="detail-value">{selectedRequest?.cardId || 'Not Assigned'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Card Type ID</span>
                                    <span className="detail-value">{selectedRequest?.cardTypeId}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Card Status</span>
                                    <span className={`badge badge-${getStatusBadge(selectedRequest?.cardStatus)}`}>
                                        {selectedRequest?.cardStatus}
                                    </span>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h4>Card Holder Personal Info</h4>
                                <div className="detail-row">
                                    <span className="detail-label">Full Name</span>
                                    <span className="detail-value">{selectedRequest?.cardHolder?.firstName} {selectedRequest?.cardHolder?.lastName}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Email</span>
                                    <span className="detail-value">{selectedRequest?.cardHolder?.email}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Mobile</span>
                                    <span className="detail-value">{selectedRequest?.cardHolder?.areaCode} {selectedRequest?.cardHolder?.mobile}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Gender</span>
                                    <span className="detail-value">{selectedRequest?.cardHolder?.gender === 'M' ? 'Male' : selectedRequest?.cardHolder?.gender === 'F' ? 'Female' : selectedRequest?.cardHolder?.gender || 'N/A'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Birthday</span>
                                    <span className="detail-value">{selectedRequest?.cardHolder?.birthday || 'N/A'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Nationality</span>
                                    <span className="detail-value">{selectedRequest?.cardHolder?.nationality}</span>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h4>Address Details</h4>
                                <div className="detail-row">
                                    <span className="detail-label">Address</span>
                                    <span className="detail-value">{selectedRequest?.cardHolder?.address || 'N/A'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Town/City</span>
                                    <span className="detail-value">{selectedRequest?.cardHolder?.town || 'N/A'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Post Code</span>
                                    <span className="detail-value">{selectedRequest?.cardHolder?.postCode || 'N/A'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Country</span>
                                    <span className="detail-value">{selectedRequest?.cardHolder?.country || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h4>Employment & Financials</h4>
                                <div className="detail-row">
                                    <span className="detail-label">Occupation</span>
                                    <span className="detail-value">{selectedRequest?.cardHolder?.occupation?.replace(/_/g, ' ') || 'N/A'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Annual Salary</span>
                                    <span className="detail-value">{selectedRequest?.cardHolder?.annualSalary || 'N/A'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Account Purpose</span>
                                    <span className="detail-value">{selectedRequest?.cardHolder?.accountPurpose || 'N/A'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Monthly Volume</span>
                                    <span className="detail-value">{selectedRequest?.cardHolder?.expectedMonthlyVolume || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h4>Identity Verification</h4>
                                <div className="detail-row">
                                    <span className="detail-label">ID Type</span>
                                    <span className="detail-value">{selectedRequest?.cardHolder?.idType || 'N/A'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">ID Number</span>
                                    <span className="detail-value">{selectedRequest?.cardHolder?.idNumber || 'N/A'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Issue Date</span>
                                    <span className="detail-value">{selectedRequest?.cardHolder?.issueDate || 'N/A'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Expiry Date</span>
                                    <span className="detail-value">{selectedRequest?.cardHolder?.idNoExpiryDate || 'N/A'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">KYC Status</span>
                                    <span className={`badge badge-${selectedRequest?.cardHolder?.statusStr?.toUpperCase() === 'PENDING' ? 'warning' :
                                        selectedRequest?.cardHolder?.statusStr?.toUpperCase() === 'APPROVED' ? 'success' : 'danger'
                                        }`}>
                                        {selectedRequest?.cardHolder?.statusStr}
                                    </span>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h4>System Information</h4>
                                <div className="detail-row">
                                    <span className="detail-label">Holder ID</span>
                                    <span className="detail-value">{selectedRequest?.holderId || selectedRequest?.cardHolder?.holderId}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Holder Model</span>
                                    <span className="detail-value">{selectedRequest?.cardHolder?.cardHolderModel || 'N/A'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">IP Address</span>
                                    <span className="detail-value">{selectedRequest?.cardHolder?.ipAddress || 'N/A'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Flow Location</span>
                                    <span className="detail-value">{selectedRequest?.cardHolder?.statusFlowLocation || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button className="btn-primary" onClick={() => setShowViewModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default CardTable;
