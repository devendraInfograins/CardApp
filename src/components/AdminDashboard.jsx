import { useState } from 'react';
import { FiBarChart2, FiUser, FiCreditCard, FiActivity, FiLogOut, FiSun, FiMoon, FiTag } from 'react-icons/fi';
import { SiBlockchaindotcom } from 'react-icons/si';
import CardHolderTable from './CardHolderTable';
import CardTable from './CardTable';
import TransactionsTable from './TransactionsTable';
import CardTypePage from './CardTypePage';
import Analytics from './Analytics';
import centraFull from '../assets/centra_full.png';
import centraAlpha from '../assets/centra_alpha.png';
import centraSwoosh1 from '../assets/centra_swoosh_1.png';
import centraSwoosh2 from '../assets/centra_swoosh_2.png';
import './AdminDashboard.css';

const AdminDashboard = ({ onLogout, theme, toggleTheme }) => {
    const [activeSection, setActiveSection] = useState('cardholder');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const navItems = [
        { id: 'analytics', label: 'Analytics', icon: FiBarChart2 },
        { id: 'cardholder', label: 'Card Holder', icon: FiUser },
        { id: 'card', label: 'Card Request', icon: FiCreditCard },
        { id: 'cardtype', label: 'Card Type', icon: FiTag },
        // { id: 'transactions', label: 'View Transaction', icon: FiActivity },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case 'cardholder':
                return <CardHolderTable />;
            case 'card':
                return <CardTable />;
            case 'cardtype':
                return <CardTypePage />;
            case 'transactions':
                return <TransactionsTable />;
            case 'analytics':
                return <Analytics />;
            default:
                return <Analytics />;
        }
    };

    const handleLogout = () => {

        onLogout();

    };

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <div className="logo">
                        <img
                            src={theme === 'dark'
                                ? (!sidebarOpen ? centraSwoosh1 : centraSwoosh2)
                                : (sidebarOpen ? centraFull : centraAlpha)
                            }
                            alt="Centra Logo"
                            className={`logo-img ${sidebarOpen ? 'full' : 'collapsed'}`}
                        />
                        {/* {sidebarOpen && <h2 className="logo-text">Centra</h2>} */}
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <button
                                key={item.id}
                                className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                                onClick={() => setActiveSection(item.id)}
                            >
                                <span className="nav-icon">
                                    <IconComponent />
                                </span>
                                {sidebarOpen && <span className="nav-label">{item.label}</span>}
                            </button>
                        );
                    })}
                </nav>

                <div className="sidebar-footer">
                    <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        {sidebarOpen ? '◀' : '▶'}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                {/* Header */}
                <header className="dashboard-header glass">
                    <div className="header-left">
                        <h1 className="page-title">
                            {navItems.find(item => item.id === activeSection)?.label}
                        </h1>
                        <p className="page-subtitle">Manage your blockchain ecosystem</p>
                    </div>

                    <div className="header-right">
                        <button
                            className="theme-toggle-btn"
                            onClick={toggleTheme}
                            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                        >
                            {theme === 'dark' ? <FiSun /> : <FiMoon />}
                        </button>
                        <button className="logout-btn" onClick={handleLogout} title="Logout">
                            <FiLogOut />
                            <span>Logout</span>
                        </button>
                        <div className="admin-profile">
                            <div className="admin-avatar">
                                <img src={centraSwoosh1} alt="Admin" className="avatar-img" />
                            </div>
                            <div className="admin-info">
                                <p className="admin-name">Admin</p>
                                <p className="admin-role">Super Admin</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="content-area fade-in">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
