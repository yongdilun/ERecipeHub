import React, { useState, useEffect } from 'react';
import AdminHeader from './AdminHeader';
import './UserOverview.css';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const UserOverview = () => {
    const [userStats, setUserStats] = useState({
        totalUsers: 0,
        newUsers: 0,
        userStats: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserStats = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log('Fetching from:', `${API_BASE_URL}/api/admin/user-overview`);
                const response = await axios.get(`${API_BASE_URL}/api/admin/user-overview`, {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                    }
                });
                console.log('Response:', response.data);
                
                if (response.data.success && response.data.data) {
                    setUserStats(response.data.data);
                } else {
                    console.error('Invalid response format:', response.data);
                    setError(response.data.message || 'Invalid response format');
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching user statistics:', err.response || err);
                setError(err.response?.data?.message || 'Failed to fetch user statistics');
                setLoading(false);
            }
        };

        fetchUserStats();
    }, []);

    if (loading) return (
        <div className="user-overview">
            <AdminHeader />
            <div className="user-overview-container">
                <div>Loading...</div>
            </div>
        </div>
    );

    if (error) return (
        <div className="user-overview">
            <AdminHeader />
            <div className="user-overview-container">
                <div className="error-message">{error}</div>
            </div>
        </div>
    );

    return (
        <div className="user-overview">
            <AdminHeader />
            <div className="user-overview-container">
                <h1>User Overview</h1>
                
                <div className="stats-cards">
                    <div className="stat-card">
                        <h3>Total Users</h3>
                        <p>{userStats.totalUsers}</p>
                    </div>
                    <div className="stat-card">
                        <h3>New Users (Last 30 Days)</h3>
                        <p>{userStats.newUsers}</p>
                    </div>
                </div>

                <div className="users-table-container">
                    <h2>User Details</h2>
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Join Date</th>
                                <th>Recipes</th>
                                <th>Comments</th>
                                <th>Ratings</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userStats.userStats.map((user) => (
                                <tr key={user._id}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>{new Date(user.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}</td>
                                    <td>{user.activity.recipes}</td>
                                    <td>{user.activity.comments}</td>
                                    <td>{user.activity.ratings}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserOverview;
