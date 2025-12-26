import { useState, useEffect } from 'react';
import './Analytics.css';

const Analytics = () => {
    const [stats, setStats] = useState({
        totalVolume: 0,
        totalTransactions: 0,
        activeWallets: 0,
        totalGasFees: 0,
    });

    useEffect(() => {
        // Simulate loading stats
        setStats({
            totalVolume: 12543.78, // in ETH
            totalTransactions: 8342,
            activeWallets: 1256,
            totalGasFees: 45.32, // in ETH
        });
    }, []);

    const volumeData = [
        { month: 'Jan', volume: 1250.5 },
        { month: 'Feb', volume: 1580.8 },
        { month: 'Mar', volume: 2120.3 },
        { month: 'Apr', volume: 1890.6 },
        { month: 'May', volume: 2540.2 },
        { month: 'Jun', volume: 2161.4 },
    ];

    const topWallets = [
        { address: '0x742d...3f8a', transactions: 145, volume: 2250.5 },
        { address: '0x8c9e...2b1d', transactions: 128, volume: 1980.3 },
        { address: '0x5a3f...7e6c', transactions: 112, volume: 1820.7 },
        { address: '0x1d2e...9a4b', transactions: 98, volume: 1650.2 },
        { address: '0x6f8a...5c3d', transactions: 85, volume: 1260.8 },
    ];

    const recentTransactions = [
        { id: 1, from: '0x742d...3f8a', to: '0x8c9e...2b1d', amount: 2.5, status: 'confirmed', blockNumber: 18234567 },
        { id: 2, from: '0x5a3f...7e6c', to: '0x1d2e...9a4b', amount: 0.75, status: 'confirmed', blockNumber: 18234566 },
        { id: 3, from: '0x6f8a...5c3d', to: '0x742d...3f8a', amount: 1.2, status: 'pending', blockNumber: 18234565 },
        { id: 4, from: '0x8c9e...2b1d', to: '0x5a3f...7e6c', amount: 3.8, status: 'confirmed', blockNumber: 18234564 },
    ];

    const maxVolume = Math.max(...volumeData.map(d => d.volume));

    return (
        <div className="analytics-container">
            {/* KPI Cards */}
            <div className="kpi-grid">
                <div className="kpi-card glass fade-in">
                    <div className="kpi-icon revenue">⚡</div>
                    <div className="kpi-content">
                        <h3 className="kpi-value">{stats.totalVolume.toFixed(2)} ETH</h3>
                        <p className="kpi-label">Total Volume</p>
                    </div>
                    <div className="kpi-trend positive">↑ 18.5%</div>
                </div>

                <div className="kpi-card glass fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="kpi-icon bookings">🔗</div>
                    <div className="kpi-content">
                        <h3 className="kpi-value">{stats.totalTransactions.toLocaleString()}</h3>
                        <p className="kpi-label">Total Transactions</p>
                    </div>
                    <div className="kpi-trend positive">↑ 12.3%</div>
                </div>

                <div className="kpi-card glass fade-in" style={{ animationDelay: '0.2s' }}>
                    <div className="kpi-icon cars">👛</div>
                    <div className="kpi-content">
                        <h3 className="kpi-value">{stats.activeWallets.toLocaleString()}</h3>
                        <p className="kpi-label">Active Wallets</p>
                    </div>
                    <div className="kpi-trend positive">↑ 8.7%</div>
                </div>

                <div className="kpi-card glass fade-in" style={{ animationDelay: '0.3s' }}>
                    <div className="kpi-icon users">⛽</div>
                    <div className="kpi-content">
                        <h3 className="kpi-value">{stats.totalGasFees.toFixed(2)} ETH</h3>
                        <p className="kpi-label">Total Gas Fees</p>
                    </div>
                    <div className="kpi-trend neutral">→ 2.1%</div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="charts-grid">
                {/* Volume Chart */}
                <div className="chart-card glass fade-in" style={{ animationDelay: '0.4s' }}>
                    <div className="chart-header">
                        <h3>Monthly Volume (ETH)</h3>
                        <select className="chart-filter">
                            <option>Last 6 Months</option>
                            <option>Last Year</option>
                        </select>
                    </div>
                    <div className="chart-container">
                        <div className="bar-chart">
                            {volumeData.map((data, index) => (
                                <div key={index} className="bar-wrapper">
                                    <div className="bar-container">
                                        <div
                                            className="bar"
                                            style={{
                                                height: `${(data.volume / maxVolume) * 100}%`,
                                                animationDelay: `${index * 0.1}s`
                                            }}
                                        >
                                            <span className="bar-value">{data.volume.toFixed(0)} ETH</span>
                                        </div>
                                    </div>
                                    <span className="bar-label">{data.month}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Top Wallets */}
                <div className="chart-card glass fade-in" style={{ animationDelay: '0.5s' }}>
                    <div className="chart-header">
                        <h3>Top Wallets</h3>
                        <span className="chart-subtitle">By transaction volume</span>
                    </div>
                    <div className="popular-cars-list">
                        {topWallets.map((wallet, index) => (
                            <div key={index} className="popular-car-item">
                                <div className="car-rank">{index + 1}</div>
                                <div className="car-info">
                                    <p className="car-name">{wallet.address}</p>
                                    <div className="car-stats">
                                        <span className="stat-badge">{wallet.transactions} txns</span>
                                        <span className="stat-revenue">{wallet.volume.toFixed(2)} ETH</span>
                                    </div>
                                </div>
                                <div className="car-progress">
                                    <div
                                        className="progress-bar"
                                        style={{ width: `${(wallet.transactions / topWallets[0].transactions) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="recent-section glass fade-in" style={{ animationDelay: '0.6s' }}>
                <div className="section-header">
                    <h3>Recent Transactions</h3>
                    <button className="btn-secondary btn-small">View All</button>
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Block</th>
                                <th>From</th>
                                <th>To</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentTransactions.map((tx) => (
                                <tr key={tx.id}>
                                    <td>#{tx.blockNumber}</td>
                                    <td>{tx.from}</td>
                                    <td>{tx.to}</td>
                                    <td>{tx.amount} ETH</td>
                                    <td>
                                        <span className={`badge badge-${tx.status === 'confirmed' ? 'success' : 'warning'}`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
