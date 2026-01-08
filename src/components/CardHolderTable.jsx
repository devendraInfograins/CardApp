import { useState, useEffect } from 'react';
import { FiSearch, FiEye, FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import { walletHolderAPI } from '../services/api';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import './DataTable.css';

const CardHolderTable = () => {
    const [walletHolders, setWalletHolders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCardHolders();
    }, []);

    const fetchCardHolders = async () => {
        try {
            setIsLoading(true);
            const response = await walletHolderAPI.getCardHolders();
            console.log("response", response);
            // The API returns data in response.data.cardHolders
            const data = response.data.cardHolders || [];
            setWalletHolders(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch card holders');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedHolder, setSelectedHolder] = useState(null);

    const filteredWalletHolders = (Array.isArray(walletHolders) ? walletHolders : [])?.filter(holder => {
        const firstName = holder?.firstName || '';
        const lastName = holder?.lastName || '';
        const email = holder?.email || '';
        const mobile = holder?.mobile || '';

        const fullName = `${firstName} ${lastName}`.toLowerCase();
        const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
            email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mobile.toString().toLowerCase().includes(searchTerm.toLowerCase());

        // Case-insensitive filter logic for statusStr
        const matchesStatus = filterStatus === 'all' ||
            holder?.statusStr?.toUpperCase() === filterStatus.toUpperCase();

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
                const currentHolders = Array.isArray(walletHolders) ? walletHolders : [];
                setWalletHolders(currentHolders.filter(holder => holder._id !== id));
                toast.success('Card holder removed successfully');
            }
        });
    };

    const handleViewClick = (holder) => {
        setSelectedHolder(holder);
        setShowViewModal(true);
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
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                    </select>

                    {/* <button className="btn-primary" onClick={() => setShowAddModal(true)}>
                        <FiPlus /> Add Wallet Holder
                    </button> */}
                </div>
            </div>

            {/* Wallet Holders Table */}
            <div className="table-wrapper glass fade-in">
                <div className="table-scroll">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Nationality</th>
                                <th>Email</th>
                                <th>Mobile</th>
                                <th>KYC Status</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan="9" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
                            ) : error ? (
                                <tr><td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: 'var(--error)' }}>{error}</td></tr>
                            ) : filteredWalletHolders.map((holder) => (
                                <tr key={holder._id}>
                                    <td>
                                        <span className="id-badge" title={holder._id}>
                                            {holder._id.slice(-6)}
                                        </span>
                                    </td>
                                    <td>{holder.firstName}</td>
                                    <td>{holder.lastName}</td>
                                    <td>{holder.nationality}</td>
                                    <td>{holder.email}</td>
                                    <td>{holder.areaCode} {holder.mobile}</td>
                                    <td>
                                        <span className={`badge badge-${holder.statusStr?.toUpperCase() === 'PENDING' ? 'warning' :
                                            holder.statusStr?.toUpperCase() === 'APPROVED' ? 'success' : 'danger'
                                            }`}>
                                            {holder.statusStr}
                                        </span>
                                    </td>
                                    <td>{new Date(holder.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="action-btn view"
                                                title="View Details"
                                                onClick={() => handleViewClick(holder)}
                                            >
                                                <FiEye />
                                            </button>

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
                    <span className="stat-value">{Array.isArray(walletHolders) ? walletHolders.length : 0}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Pending KYC:</span>
                    <span className="stat-value">{Array.isArray(walletHolders) ? walletHolders.filter(h => h.statusStr?.toUpperCase() === 'PENDING').length : 0}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Approved:</span>
                    <span className="stat-value">{Array.isArray(walletHolders) ? walletHolders.filter(h => h.statusStr?.toUpperCase() === 'APPROVED').length : 0}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Showing:</span>
                    <span className="stat-value">{filteredWalletHolders.length}</span>
                </div>
            </div>

            {/* View Details Modal */}
            {showViewModal && (
                <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
                    <div className="modal-content glass-strong" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Card Holder Details</h3>
                            <button className="close-btn" onClick={() => setShowViewModal(false)}><FiX /></button>
                        </div>
                        <div className="details-content">
                            <div className="detail-section">
                                <h4>Personal Information</h4>
                                <div className="detail-row">
                                    <span className="detail-label">Full Name</span>
                                    <span className="detail-value">{selectedHolder?.firstName} {selectedHolder?.lastName}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Gender</span>
                                    <span className="detail-value">{selectedHolder?.gender === 'M' ? 'Male' : selectedHolder?.gender === 'F' ? 'Female' : selectedHolder?.gender || 'N/A'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Birthday</span>
                                    <span className="detail-value">{selectedHolder?.birthday || 'N/A'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Nationality</span>
                                    <span className="detail-value">{selectedHolder?.nationality}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Email</span>
                                    <span className="detail-value">{selectedHolder?.email}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Mobile</span>
                                    <span className="detail-value">{selectedHolder?.areaCode} {selectedHolder?.mobile}</span>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h4>Address Details</h4>
                                <div className="detail-row">
                                    <span className="detail-label">Address</span>
                                    <span className="detail-value">{selectedHolder?.address || 'N/A'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Town/City</span>
                                    <span className="detail-value">{selectedHolder?.town || 'N/A'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Post Code</span>
                                    <span className="detail-value">{selectedHolder?.postCode || 'N/A'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Country</span>
                                    <span className="detail-value">{selectedHolder?.country || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h4>Employment & Financials</h4>
                                <div className="detail-row">
                                    <span className="detail-label">Occupation</span>
                                    <span className="detail-value">{selectedHolder?.occupation?.replace(/_/g, ' ') || 'N/A'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Annual Salary</span>
                                    <span className="detail-value">{selectedHolder?.annualSalary || 'N/A'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Account Purpose</span>
                                    <span className="detail-value">{selectedHolder?.accountPurpose || 'N/A'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Monthly Volume</span>
                                    <span className="detail-value">{selectedHolder?.expectedMonthlyVolume || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h4>Identity Verification</h4>
                                <div className="detail-row">
                                    <span className="detail-label">ID Type</span>
                                    <span className="detail-value">{selectedHolder?.idType || 'N/A'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">ID Number</span>
                                    <span className="detail-value">{selectedHolder?.idNumber || 'N/A'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Issue Date</span>
                                    <span className="detail-value">{selectedHolder?.issueDate || 'N/A'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">KYC Status</span>
                                    <span className={`badge badge-${selectedHolder?.statusStr?.toUpperCase() === 'PENDING' ? 'warning' :
                                        selectedHolder?.statusStr?.toUpperCase() === 'APPROVED' ? 'success' : 'danger'
                                        }`}>
                                        {selectedHolder?.statusStr}
                                    </span>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h4>System Information</h4>
                                <div className="detail-row">
                                    <span className="detail-label">Holder Model</span>
                                    <span className="detail-value">{selectedHolder?.cardHolderModel || 'N/A'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Created At</span>
                                    <span className="detail-value">{new Date(selectedHolder?.createdAt).toLocaleString()}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">System ID</span>
                                    <span className="detail-value" style={{ fontSize: '0.8rem', opacity: 0.7 }}>{selectedHolder?._id}</span>
                                </div>
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button className="btn-primary" onClick={() => setShowViewModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Wallet Holder Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal-content glass-strong" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Add New Wallet Holder</h3>
                            <button className="close-btn" onClick={() => setShowAddModal(false)}><FiX /></button>
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
