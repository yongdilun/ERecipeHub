import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminHeader from './AdminHeader';
import './AdminDashboard.css';
import { FaUsers, FaUtensils, FaComments, FaChartLine } from 'react-icons/fa';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    users: { total: 0, new: 0, active: 0 },
    recipes: { total: 0, recent: [], popular: [] },
    comments: { total: 0, recent: [] }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log('Fetching dashboard data from:', `${API_BASE_URL}/api/admin/overview`);
        const response = await axios.get(`${API_BASE_URL}/api/admin/overview`);
        console.log('Dashboard data response:', response.data);
        
        if (response.data) {
          setDashboardData(response.data);
        } else {
          console.error('Invalid response format:', response.data);
          setError('Invalid data format received');
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-dashboard">
      <AdminHeader />
      <div className="dashboard-container">
        <h1>Admin Dashboard</h1>
        
        <div className="stats-grid">
          <div className="stat-card">
            <FaUsers className="stat-icon" />
            <div className="stat-content">
              <h3>Users</h3>
              <p className="stat-number">{dashboardData.users?.total || 0}</p>
              <div className="stat-details">
                <span>New (1h): {dashboardData.users?.recent || 0}</span>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <FaUtensils className="stat-icon" />
            <div className="stat-content">
              <h3>Recipes</h3>
              <p className="stat-number">{dashboardData.recipes?.total || 0}</p>
              <div className="stat-details">
                <span>New (1h): {dashboardData.recipes?.recent || 0}</span>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <FaComments className="stat-icon" />
            <div className="stat-content">
              <h3>Comments</h3>
              <p className="stat-number">{dashboardData.comments?.total || 0}</p>
              <div className="stat-details">
                <span>New (1h): {dashboardData.comments?.recent || 0}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="data-sections">
          <section className="recent-recipes">
            <h2>Recent Recipes</h2>
            <div className="data-list">
              {dashboardData.recipes?.latest?.map(recipe => (
                <div key={recipe._id} className="list-item">
                  <span>{recipe.title}</span>
                  <span>by {recipe.user_id?.username || 'Unknown'}</span>
                </div>
              )) || <p>No recent recipes</p>}
            </div>
          </section>

          <section className="popular-recipes">
            <h2>Popular Recipes</h2>
            <div className="data-list">
              {dashboardData.recipes?.popular?.map(recipe => (
                <div key={recipe._id} className="list-item">
                  <div className="recipe-info">
                    <span className="recipe-title">{recipe.title}</span>
                    <span className="recipe-creator">by {recipe.creatorName || 'Unknown'}</span>
                  </div>
                  <div className="recipe-stats">
                    <span className="rating">Rating: {recipe.averageRating?.toFixed(1) || 'N/A'}</span>
                    <span className="rating-count">({recipe.ratingCount} ratings)</span>
                    <span className="weighted-score">Score: {recipe.weightedScore}</span>
                  </div>
                </div>
              )) || <p>No popular recipes</p>}
            </div>
          </section>

          <section className="recent-comments">
            <h2>Recent Comments</h2>
            <div className="data-list">
              {dashboardData.comments?.latest?.map(comment => (
                <div key={comment._id} className="list-item">
                  <span>{comment.user_id?.username || 'Unknown'}</span>
                  <span>on {comment.recipe_id?.title || 'Unknown Recipe'}</span>
                </div>
              )) || <p>No recent comments</p>}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
