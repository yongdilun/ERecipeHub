import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    userId: '',
    username: '',
    email: ''
  });

  useEffect(() => {
    // Get user info from localStorage
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');

    if (!userId || !username) {
      navigate('/login');
      return;
    }

    // Update state with user info
    setUserInfo({
      userId,
      username,
      email
    });
  }, [navigate]);

  const handleLogout = () => {
    // Clear authentication-related data
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('email');

    // Redirect to login page
    navigate('/login');
  };

  const handleChangePassword = () => {
    navigate('/change-password');
  };

  return (
    <div>
      <Header />
      <div className="profile-page">
        <section className="hero-section">
          <h1>Your Profile</h1>
          <p>Manage your account and personal information</p>
        </section>

        <div className="profile-container">
          <div className="profile-card">
            <h2>Profile Information</h2>
            <div className="profile-info">
              <div className="info-item">
                <label>User ID:</label>
                <span>{userInfo.userId}</span>
              </div>
              <div className="info-item">
                <label>Username:</label>
                <span>{userInfo.username}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{userInfo.email || 'Not available'}</span>
              </div>
            </div>
            <div className="profile-actions">
              <button 
                onClick={handleChangePassword}
                className="change-password-button"
              >
                Change Password
              </button>
              <button 
                onClick={handleLogout}
                className="logout-button"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
