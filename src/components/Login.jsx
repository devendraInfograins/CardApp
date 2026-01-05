import { useState } from 'react';
import { SiBlockchaindotcom } from 'react-icons/si';
import { FiMail, FiLock, FiShield, FiZap } from 'react-icons/fi';
import { RiSecurePaymentLine } from 'react-icons/ri';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

import './Login.css';

const Login = ({ onLogin }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Call the API service
            const response = await authAPI.login(formData);
            console.log(response);

            // Store token if provided
            const token = response.data.token || response.data.data?.token;
            if (token) {
                localStorage.setItem('authToken', token);
            }

            // Call parent callback with user data
            // Try to find user in response.data.user, response.data.data.user, or fallback to a default
            const userData = response.data.user || response.data.data?.user || {
                email: formData.email,
                name: 'Admin User',
                role: 'Super Admin'
            };

            onLogin(userData);
            toast.success(`Welcome back, ${userData.name || 'Admin'}!`);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Login failed. Please try again.';
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
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
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                            />

                            <span
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                role="button"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </span>
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
                        {/* <p className="demo-text">Demo Access:</p> */}

                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
