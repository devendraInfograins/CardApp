import { useState, useEffect } from 'react';
import { FiSearch, FiPlus, FiX, FiEye } from 'react-icons/fi';
import { cardTypeAPI } from '../services/api';
import toast from 'react-hot-toast';
import './DataTable.css';

const CardTypePage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [cardTypes, setCardTypes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [formData, setFormData] = useState({
        cardName: '',
        organization: 'Visa',
        cardTypeId: '',
        type: 'Physical',
        cardPrice: '0',
        cardPriceCurrency: 'USD',
        support: 'Visa',
        needCardHolder: true,
        needDepositForActiveCard: false,
        depositAmountMinQuotaForActiveCard: '10',
        depositAmountMaxQuotaForActiveCard: '1000000',
        fiatCurrency: 'USD',
        status: 'online',
        rechargeCurrency: 'USD',
        rechargeMinQuota: '10',
        rechargeMaxQuota: '1000000',
        rechargeFeeRate: '1',
        rechargeFixedFee: '0',
        rechargeDigital: 2,
        enableActiveCard: true,
        enableDeposit: true,
        enableWithdraw: false,
        enableCancel: true,
        enableFreeze: true,
        enableUnFreeze: true
    });

    useEffect(() => {
        fetchCardTypes();
    }, []);

    const fetchCardTypes = async () => {
        try {
            setIsLoading(true);
            const response = await cardTypeAPI.getCardInfoList();
            const data = response.data.cardInfo || response.data.cardInfoList || response.data.data || [];
            setCardTypes(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch card types');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredCardTypes = cardTypes.filter(card =>
        card.cardName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.cardTypeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.organization?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleToggle = (name) => {
        setFormData(prev => ({
            ...prev,
            [name]: !prev[name]
        }));
    };

    const resetForm = () => {
        setFormData({
            cardName: '',
            organization: 'Visa',
            cardTypeId: '',
            type: 'Physical',
            cardPrice: '0',
            cardPriceCurrency: 'USD',
            support: 'Visa',
            needCardHolder: true,
            needDepositForActiveCard: false,
            depositAmountMinQuotaForActiveCard: '10',
            depositAmountMaxQuotaForActiveCard: '1000000',
            fiatCurrency: 'USD',
            status: 'online',
            rechargeCurrency: 'USD',
            rechargeMinQuota: '10',
            rechargeMaxQuota: '1000000',
            rechargeFeeRate: '1',
            rechargeFixedFee: '0',
            rechargeDigital: 2,
            enableActiveCard: true,
            enableDeposit: true,
            enableWithdraw: false,
            enableCancel: true,
            enableFreeze: true,
            enableUnFreeze: true
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            await cardTypeAPI.createCardInfo(formData);
            toast.success('Card type created successfully!');
            resetForm();
            setShowAddModal(false);
            fetchCardTypes();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to create card type');
        } finally {
            setIsLoading(false);
        }
    };

    const ToggleSwitch = ({ name, value, label }) => (
        <div className="form-group">
            <label>{label}</label>
            <div className="toggle-container">
                <button
                    type="button"
                    className={`toggle-btn-option ${value ? 'active' : ''}`}
                    onClick={() => handleToggle(name)}
                >
                    Yes
                </button>
                <button
                    type="button"
                    className={`toggle-btn-option ${!value ? 'active' : ''}`}
                    onClick={() => handleToggle(name)}
                >
                    No
                </button>
            </div>
        </div>
    );

    const getStatusBadge = (status) => {
        return status === 'online' ? 'success' : 'danger';
    };

    return (
        <div className="data-table-container">
            {/* Header Actions */}
            <div className="table-actions glass">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search by name, ID, or organization..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <span className="search-icon"><FiSearch /></span>
                </div>

                <div className="filter-actions">
                    <button className="btn-primary" onClick={() => setShowAddModal(true)}>
                        <FiPlus style={{ marginRight: '0.5rem' }} />
                        Add Card Type
                    </button>
                </div>
            </div>

            {/* Card Types Table */}
            <div className="table-wrapper glass fade-in">
                <div className="table-scroll">
                    <table>
                        <thead>
                            <tr>
                                <th>Card Name</th>
                                <th>Card Type ID</th>
                                <th>Organization</th>
                                <th>Type</th>
                                <th>Support</th>
                                <th>Price (USD)</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
                            ) : filteredCardTypes.length === 0 ? (
                                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>No card types found</td></tr>
                            ) : filteredCardTypes.map((card, index) => (
                                <tr key={card._id || card.cardTypeId || index}>
                                    <td>{card.cardName}</td>
                                    <td>
                                        <span className="id-badge">{card.cardTypeId}</span>
                                    </td>
                                    <td>{card.organization}</td>
                                    <td>{card.type}</td>
                                    <td>{card.support}</td>
                                    <td>
                                        <span className="price-tag">${card.cardPrice || '0'}</span>
                                    </td>
                                    <td>
                                        <span className={`badge badge-${getStatusBadge(card.status)}`}>
                                            {card.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="action-btn view"
                                                title="View Details"
                                                onClick={() => {
                                                    setSelectedCard(card);
                                                    setShowViewModal(true);
                                                }}
                                            >
                                                <FiEye />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Stats Footer */}
            <div className="table-stats glass">
                <div className="stat-item">
                    <span className="stat-label">Total Card Types:</span>
                    <span className="stat-value">{cardTypes.length}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Online:</span>
                    <span className="stat-value">{cardTypes.filter(c => c.status === 'online').length}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Showing:</span>
                    <span className="stat-value">{filteredCardTypes.length}</span>
                </div>
            </div>

            {/* Add Card Type Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal-content glass-strong" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', maxHeight: '85vh' }}>
                        <div className="modal-header">
                            <h3>Create New Card Type</h3>
                            <button className="close-btn" onClick={() => setShowAddModal(false)}><FiX /></button>
                        </div>
                        <form className="card-type-form" onSubmit={handleSubmit}>
                            {/* Basic Information */}
                            <div className="form-section">
                                <h3 className="section-title">Basic Information</h3>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Card Name</label>
                                        <input
                                            type="text"
                                            name="cardName"
                                            value={formData.cardName}
                                            onChange={handleChange}
                                            placeholder="e.g., Xcentra Physical Card"
                                            className="form-input"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Card Type ID</label>
                                        <input
                                            type="text"
                                            name="cardTypeId"
                                            value={formData.cardTypeId}
                                            onChange={handleChange}
                                            placeholder="e.g., 111053"
                                            className="form-input"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Organization</label>
                                        <select
                                            name="organization"
                                            value={formData.organization}
                                            onChange={handleChange}
                                            className="filter-select form-select"
                                        >
                                            <option value="Visa">Visa</option>
                                            <option value="Mastercard">Mastercard</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Card Type</label>
                                        <select
                                            name="type"
                                            value={formData.type}
                                            onChange={handleChange}
                                            className="filter-select form-select"
                                        >
                                            <option value="Physical">Physical</option>
                                            <option value="Virtual">Virtual</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Support</label>
                                        <select
                                            name="support"
                                            value={formData.support}
                                            onChange={handleChange}
                                            className="filter-select form-select"
                                        >
                                            <option value="Visa">Visa</option>
                                            <option value="Mastercard">Mastercard</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Status</label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            className="filter-select form-select"
                                        >
                                            <option value="online">Online</option>
                                            <option value="offline">Offline</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Pricing */}
                            <div className="form-section">
                                <h3 className="section-title">Pricing (USD)</h3>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Card Price</label>
                                        <input
                                            type="number"
                                            name="cardPrice"
                                            value={formData.cardPrice}
                                            onChange={handleChange}
                                            className="form-input"
                                            min="0"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Deposit Settings */}
                            <div className="form-section">
                                <h3 className="section-title">Deposit Settings</h3>
                                <div className="form-grid">
                                    <ToggleSwitch
                                        name="needDepositForActiveCard"
                                        value={formData.needDepositForActiveCard}
                                        label="Need Deposit for Active Card"
                                    />
                                    <div className="form-group">
                                        <label>Min Deposit (USD)</label>
                                        <input
                                            type="number"
                                            name="depositAmountMinQuotaForActiveCard"
                                            value={formData.depositAmountMinQuotaForActiveCard}
                                            onChange={handleChange}
                                            className="form-input"
                                            min="0"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Max Deposit (USD)</label>
                                        <input
                                            type="number"
                                            name="depositAmountMaxQuotaForActiveCard"
                                            value={formData.depositAmountMaxQuotaForActiveCard}
                                            onChange={handleChange}
                                            className="form-input"
                                            min="0"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Recharge Settings */}
                            <div className="form-section">
                                <h3 className="section-title">Recharge Settings</h3>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Min Recharge (USD)</label>
                                        <input
                                            type="number"
                                            name="rechargeMinQuota"
                                            value={formData.rechargeMinQuota}
                                            onChange={handleChange}
                                            className="form-input"
                                            min="0"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Max Recharge (USD)</label>
                                        <input
                                            type="number"
                                            name="rechargeMaxQuota"
                                            value={formData.rechargeMaxQuota}
                                            onChange={handleChange}
                                            className="form-input"
                                            min="0"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Recharge Fee Rate (%)</label>
                                        <input
                                            type="number"
                                            name="rechargeFeeRate"
                                            value={formData.rechargeFeeRate}
                                            onChange={handleChange}
                                            className="form-input"
                                            min="0"
                                            step="0.01"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Fixed Fee (USD)</label>
                                        <input
                                            type="number"
                                            name="rechargeFixedFee"
                                            value={formData.rechargeFixedFee}
                                            onChange={handleChange}
                                            className="form-input"
                                            min="0"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Recharge Digital</label>
                                        <input
                                            type="number"
                                            name="rechargeDigital"
                                            value={formData.rechargeDigital}
                                            onChange={handleChange}
                                            className="form-input"
                                            min="0"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Card Holder Settings */}
                            <div className="form-section">
                                <h3 className="section-title">Card Holder Settings</h3>
                                <div className="form-grid">
                                    <ToggleSwitch
                                        name="needCardHolder"
                                        value={formData.needCardHolder}
                                        label="Need Card Holder"
                                    />
                                </div>
                            </div>

                            {/* Feature Toggles */}
                            <div className="form-section">
                                <h3 className="section-title">Features</h3>
                                <div className="form-grid">
                                    <ToggleSwitch
                                        name="enableActiveCard"
                                        value={formData.enableActiveCard}
                                        label="Enable Active Card"
                                    />
                                    <ToggleSwitch
                                        name="enableDeposit"
                                        value={formData.enableDeposit}
                                        label="Enable Deposit"
                                    />
                                    <ToggleSwitch
                                        name="enableWithdraw"
                                        value={formData.enableWithdraw}
                                        label="Enable Withdraw"
                                    />
                                    <ToggleSwitch
                                        name="enableCancel"
                                        value={formData.enableCancel}
                                        label="Enable Cancel"
                                    />
                                    <ToggleSwitch
                                        name="enableFreeze"
                                        value={formData.enableFreeze}
                                        label="Enable Freeze"
                                    />
                                    <ToggleSwitch
                                        name="enableUnFreeze"
                                        value={formData.enableUnFreeze}
                                        label="Enable Unfreeze"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Creating...' : 'Create Card Type'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Details Modal */}
            {showViewModal && selectedCard && (
                <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
                    <div className="modal-content glass-strong" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
                        <div className="modal-header">
                            <h3>Card Type Details</h3>
                            <button className="close-btn" onClick={() => setShowViewModal(false)}><FiX /></button>
                        </div>
                        <div className="details-content">
                            <div className="detail-section">
                                <h4>Basic Information</h4>
                                <div className="detail-row">
                                    <span className="detail-label">Card Name</span>
                                    <span className="detail-value">{selectedCard.cardName}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Card Type ID</span>
                                    <span className="detail-value">{selectedCard.cardTypeId}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Organization</span>
                                    <span className="detail-value">{selectedCard.organization}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Type</span>
                                    <span className="detail-value">{selectedCard.type}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Support</span>
                                    <span className="detail-value">{selectedCard.support}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Status</span>
                                    <span className={`badge badge-${getStatusBadge(selectedCard.status)}`}>
                                        {selectedCard.status}
                                    </span>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h4>Pricing</h4>
                                <div className="detail-row">
                                    <span className="detail-label">Card Price</span>
                                    <span className="detail-value highlight">${selectedCard.cardPrice} {selectedCard.cardPriceCurrency}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Fiat Currency</span>
                                    <span className="detail-value">{selectedCard.fiatCurrency}</span>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h4>Deposit Settings</h4>
                                <div className="detail-row">
                                    <span className="detail-label">Need Deposit for Active Card</span>
                                    <span className={`badge badge-${selectedCard.needDepositForActiveCard ? 'success' : 'danger'}`}>
                                        {selectedCard.needDepositForActiveCard ? 'Yes' : 'No'}
                                    </span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Min Deposit</span>
                                    <span className="detail-value">${selectedCard.depositAmountMinQuotaForActiveCard}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Max Deposit</span>
                                    <span className="detail-value">${selectedCard.depositAmountMaxQuotaForActiveCard}</span>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h4>Recharge Settings</h4>
                                <div className="detail-row">
                                    <span className="detail-label">Recharge Currency</span>
                                    <span className="detail-value">{selectedCard.rechargeCurrency}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Min Recharge</span>
                                    <span className="detail-value">${selectedCard.rechargeMinQuota}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Max Recharge</span>
                                    <span className="detail-value">${selectedCard.rechargeMaxQuota}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Fee Rate</span>
                                    <span className="detail-value">{selectedCard.rechargeFeeRate}%</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Fixed Fee</span>
                                    <span className="detail-value">${selectedCard.rechargeFixedFee}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Recharge Digital</span>
                                    <span className="detail-value">{selectedCard.rechargeDigital}</span>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h4>Card Holder Settings</h4>
                                <div className="detail-row">
                                    <span className="detail-label">Need Card Holder</span>
                                    <span className={`badge badge-${selectedCard.needCardHolder ? 'success' : 'danger'}`}>
                                        {selectedCard.needCardHolder ? 'Yes' : 'No'}
                                    </span>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h4>Features</h4>
                                <div className="detail-row">
                                    <span className="detail-label">Enable Active Card</span>
                                    <span className={`badge badge-${selectedCard.enableActiveCard ? 'success' : 'danger'}`}>
                                        {selectedCard.enableActiveCard ? 'Yes' : 'No'}
                                    </span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Enable Deposit</span>
                                    <span className={`badge badge-${selectedCard.enableDeposit ? 'success' : 'danger'}`}>
                                        {selectedCard.enableDeposit ? 'Yes' : 'No'}
                                    </span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Enable Withdraw</span>
                                    <span className={`badge badge-${selectedCard.enableWithdraw ? 'success' : 'danger'}`}>
                                        {selectedCard.enableWithdraw ? 'Yes' : 'No'}
                                    </span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Enable Cancel</span>
                                    <span className={`badge badge-${selectedCard.enableCancel ? 'success' : 'danger'}`}>
                                        {selectedCard.enableCancel ? 'Yes' : 'No'}
                                    </span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Enable Freeze</span>
                                    <span className={`badge badge-${selectedCard.enableFreeze ? 'success' : 'danger'}`}>
                                        {selectedCard.enableFreeze ? 'Yes' : 'No'}
                                    </span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Enable Unfreeze</span>
                                    <span className={`badge badge-${selectedCard.enableUnFreeze ? 'success' : 'danger'}`}>
                                        {selectedCard.enableUnFreeze ? 'Yes' : 'No'}
                                    </span>
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

export default CardTypePage;
