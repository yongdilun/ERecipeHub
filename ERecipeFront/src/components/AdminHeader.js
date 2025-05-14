import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminHeader.css';

const AdminHeader = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <header className="admin-header">
      <div className="logo-container">
        <img src="/images/logo.png" alt="Recipe Hub Admin" className="logo" />
        <span className="admin-badge">Admin Panel</span>
      </div>

      <nav className="admin-nav-links">
        <Link to="/admin/dashboard">Dashboard</Link>
        <Link to="/admin/users">User Overview</Link>
        <Link to="/admin/recipes">Recipe Overview</Link>
        <Link to="/admin/reports">Reports</Link>
        <div className="admin-profile">
          <span>Welcome, {username}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </nav>
    </header>
  );
};

export default AdminHeader;