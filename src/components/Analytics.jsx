import { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import './Analytics.css';

const Analytics = () => {
    const [stats, setStats] = useState({
        totalVolume: 0,
        totalTransactions: 0,
        activeWallets: 0,
        totalGasFees: 0,
    });
    const [volumeData, setVolumeData] = useState([]);
    const [topWallets, setTopWallets] = useState([]);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    const fetchAnalyticsData = async () => {
        try {
            setIsLoading(true);
            const [statsRes, volumeRes, topWalletsRes, recentTxnsRes] = await Promise.all([
                analyticsAPI.getStats(),
                analyticsAPI.getVolumeData(),
                analyticsAPI.getTopWallets(),
                analyticsAPI.getRecentTransactions()
            ]);

            setStats(statsRes.data.stats || statsRes.data.data || statsRes.data);
            setVolumeData(volumeRes.data.volumeData || volumeRes.data.data || (Array.isArray(volumeRes.data) ? volumeRes.data : []));
            setTopWallets(topWalletsRes.data.topWallets || topWalletsRes.data.data || (Array.isArray(topWalletsRes.data) ? topWalletsRes.data : []));
            setRecentTransactions(recentTxnsRes.data.recentTransactions || recentTxnsRes.data.data || (Array.isArray(recentTxnsRes.data) ? recentTxnsRes.data : []));
            setError(null);
        } catch (err) {
            setError('Failed to fetch analytics data');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className="analytics-container"><div className="glass fade-in" style={{ padding: '2rem', textAlign: 'center' }}>Loading Analytics...</div></div>;
    if (error) return <div className="analytics-container"><div className="glass fade-in" style={{ padding: '2rem', textAlign: 'center', color: 'var(--error)' }}>{error}</div></div>;

    const maxVolume = volumeData.length > 0 ? Math.max(...volumeData.map(d => d.volume)) : 0;

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
                                        style={{ width: `${topWallets.length > 0 ? (wallet.transactions / topWallets[0].transactions) * 100 : 0}%` }}
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
