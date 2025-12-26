import { useState } from 'react';
import { SiBlockchaindotcom } from 'react-icons/si';
import { FiMail, FiLock, FiShield, FiZap } from 'react-icons/fi';
import { RiSecurePaymentLine } from 'react-icons/ri';
import './Login.css';

const Login = ({ onLogin }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate authentication (replace with real API call)
        setTimeout(() => {
            // Demo credentials - you can replace this with real authentication
            if (formData.email && formData.password) {
                const userData = {
                    email: formData.email,
                    name: 'Admin User',
                    role: 'Super Admin'
                };
                onLogin(userData);
            } else {
                setError('Please enter both email and password');
                setIsLoading(false);
            }
        }, 1000);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    // Quick login for demo
    const handleQuickLogin = () => {
        setFormData({
            email: 'admin@blockchain.com',
            password: 'admin123'
        });
    };

    return (
        <div className="login-container">
            <div className="login-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>
            </div>

            <div className="login-card glass-strong fade-in">
                <div className="login-header">
                    <div className="login-icon">
                        <SiBlockchaindotcom />
                    </div>
                    <h1 className="login-title">Blockchain</h1>
                    <p className="login-subtitle">Secure access to your blockchain dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && (
                        <div className="error-message">
                            <span>⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <div className="input-wrapper">
                            <span className="input-icon">
                                <FiMail />
                            </span>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="admin@blockchain.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-wrapper">
                            <span className="input-icon">
                                <FiLock />
                            </span>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-options">
                        <label className="checkbox-label">
                            <input type="checkbox" />
                            <span>Remember me</span>
                        </label>
                        <a href="#" className="forgot-link">Forgot password?</a>
                    </div>

                    <button
                        type="submit"
                        className="btn-login"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner"></span>
                                Signing in...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>

                    <div className="demo-section">
                        <p className="demo-text">Demo Access:</p>
                        <button
                            type="button"
                            className="btn-demo"
                            onClick={handleQuickLogin}
                        >
                            🚀 Quick Login (Demo)
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
