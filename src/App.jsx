import { useState, useEffect } from 'react';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import { Toaster } from 'react-hot-toast';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser && savedUser !== 'undefined') {
      try {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogin = (userData) => {
    if (userData) {
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.clear();
    // Keep theme after logout
    localStorage.setItem('theme', theme);
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      {isAuthenticated ? (
        <AdminDashboard
          onLogout={handleLogout}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      ) : (
        <Login onLogin={handleLogin} theme={theme} />
      )}
    </>
  );
}

export default App;
