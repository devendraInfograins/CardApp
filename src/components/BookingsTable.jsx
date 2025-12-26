import { useState } from 'react';
import './DataTable.css';

const BookingsTable = () => {
    const [bookings, setBookings] = useState([
        { id: 1, customer: 'John Doe', car: 'Tesla Model 3', startDate: '2025-12-26', endDate: '2025-12-30', total: 356, status: 'active', payment: 'paid' },
        { id: 2, customer: 'Jane Smith', car: 'BMW X5', startDate: '2025-12-20', endDate: '2025-12-25', total: 625, status: 'completed', payment: 'paid' },
        { id: 3, customer: 'Mike Johnson', car: 'Audi A4', startDate: '2025-12-28', endDate: '2026-01-02', total: 425, status: 'pending', payment: 'pending' },
        { id: 4, customer: 'Sarah Williams', car: 'Mercedes C-Class', startDate: '2025-12-22', endDate: '2025-12-24', total: 190, status: 'completed', payment: 'paid' },
        { id: 5, customer: 'David Brown', car: 'Toyota Camry', startDate: '2025-12-15', endDate: '2025-12-18', total: 195, status: 'cancelled', payment: 'refunded' },
        { id: 6, customer: 'Emily Davis', car: 'Porsche 911', startDate: '2025-12-29', endDate: '2026-01-05', total: 1750, status: 'active', payment: 'paid' },
        { id: 7, customer: 'Chris Wilson', car: 'Range Rover', startDate: '2025-12-24', endDate: '2025-12-27', total: 540, status: 'active', payment: 'paid' },
        { id: 8, customer: 'Lisa Anderson', car: 'Honda Accord', startDate: '2025-12-18', endDate: '2025-12-21', total: 165, status: 'completed', payment: 'paid' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch = booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.car.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const handleViewDetails = (booking) => {
        setSelectedBooking(booking);
        setShowDetailsModal(true);
    };

    const handleCancel = (id) => {
        if (confirm('Are you sure you want to cancel this booking?')) {
            setBookings(bookings.map(booking =>
                booking.id === id ? { ...booking, status: 'cancelled', payment: 'refunded' } : booking
            ));
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'active': 'success',
            'completed': 'info',
            'pending': 'warning',
            'cancelled': 'danger'
        };
        return statusMap[status] || 'info';
    };

    const getPaymentBadge = (payment) => {
        const paymentMap = {
            'paid': 'success',
            'pending': 'warning',
            'refunded': 'info'
        };
        return paymentMap[payment] || 'warning';
    };

    const calculateDuration = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        return days;
    };

    return (
        <div className="data-table-container">
            {/* Header Actions */}
            <div className="table-actions glass">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search bookings..."
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
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                    </select>

                    <button className="btn-primary">
                        + New Booking
                    </button>
                </div>
            </div>

            {/* Bookings Table */}
            <div className="table-wrapper glass fade-in">
                <div className="table-scroll">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Customer</th>
                                <th>Car</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Duration</th>
                                <th>Total</th>
                                <th>Payment</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.map((booking) => (
                                <tr key={booking.id}>
                                    <td>#{booking.id}</td>
                                    <td>
                                        <div className="customer-cell">
                                            <div className="customer-avatar">{booking.customer.charAt(0)}</div>
                                            <span>{booking.customer}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="car-name-booking">{booking.car}</span>
                                    </td>
                                    <td>{booking.startDate}</td>
                                    <td>{booking.endDate}</td>
                                    <td>
                                        <span className="duration-badge">
                                            {calculateDuration(booking.startDate, booking.endDate)} days
                                        </span>
                                    </td>
                                    <td>
                                        <span className="total-amount">${booking.total}</span>
                                    </td>
                                    <td>
                                        <span className={`badge badge-${getPaymentBadge(booking.payment)}`}>
                                            {booking.payment}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge badge-${getStatusBadge(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="action-btn view"
                                                onClick={() => handleViewDetails(booking)}
                                                title="View Details"
                                            >
                                                👁️
                                            </button>
                                            {booking.status === 'active' && (
                                                <button
                                                    className="action-btn delete"
                                                    onClick={() => handleCancel(booking.id)}
                                                    title="Cancel Booking"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredBookings.length === 0 && (
                        <div className="empty-state">
                            <p>No bookings found matching your search criteria</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Footer */}
            <div className="table-stats glass">
                <div className="stat-item">
                    <span className="stat-label">Total Bookings:</span>
                    <span className="stat-value">{bookings.length}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Active:</span>
                    <span className="stat-value">{bookings.filter(b => b.status === 'active').length}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Total Revenue:</span>
                    <span className="stat-value">${bookings.filter(b => b.payment === 'paid').reduce((sum, b) => sum + b.total, 0).toLocaleString()}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Showing:</span>
                    <span className="stat-value">{filteredBookings.length}</span>
                </div>
            </div>

            {/* Booking Details Modal */}
            {showDetailsModal && selectedBooking && (
                <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
                    <div className="modal-content glass-strong booking-details" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Booking Details - #{selectedBooking.id}</h3>
                            <button className="close-btn" onClick={() => setShowDetailsModal(false)}>×</button>
                        </div>
                        <div className="details-content">
                            <div className="detail-section">
                                <h4>Customer Information</h4>
                                <div className="detail-row">
                                    <span className="detail-label">Name:</span>
                                    <span className="detail-value">{selectedBooking.customer}</span>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h4>Rental Information</h4>
                                <div className="detail-row">
                                    <span className="detail-label">Car:</span>
                                    <span className="detail-value">{selectedBooking.car}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Start Date:</span>
                                    <span className="detail-value">{selectedBooking.startDate}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">End Date:</span>
                                    <span className="detail-value">{selectedBooking.endDate}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Duration:</span>
                                    <span className="detail-value">
                                        {calculateDuration(selectedBooking.startDate, selectedBooking.endDate)} days
                                    </span>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h4>Payment Information</h4>
                                <div className="detail-row">
                                    <span className="detail-label">Total Amount:</span>
                                    <span className="detail-value highlight">${selectedBooking.total}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Payment Status:</span>
                                    <span className={`badge badge-${getPaymentBadge(selectedBooking.payment)}`}>
                                        {selectedBooking.payment}
                                    </span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Booking Status:</span>
                                    <span className={`badge badge-${getStatusBadge(selectedBooking.status)}`}>
                                        {selectedBooking.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => setShowDetailsModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingsTable;
