import React, { useState, useEffect } from 'react';
import AdminHeader from './AdminHeader';
import './RecipeOverview.css';
import axios from 'axios';
import { FaStar, FaClock, FaUtensils, FaHourglassHalf, FaSearch, FaComment } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const RecipeOverview = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('latest');
    const [cuisine, setCuisine] = useState('All');

    useEffect(() => {
        fetchRecipes();
    }, [searchTerm, sortBy, cuisine]);

    const fetchRecipes = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('Fetching from:', `${API_BASE_URL}/api/admin/recipe-overview`);
            const response = await axios.get(`${API_BASE_URL}/api/admin/recipe-overview`, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    search: searchTerm,
                    sortBy,
                    cuisine: cuisine !== 'All' ? cuisine : ''
                }
            });
            
            if (response.data.success) {
                setRecipes(response.data.data);
            } else {
                setError('Failed to fetch recipes');
            }
            setLoading(false);
        } catch (err) {
            console.error('Error:', err);
            setError('Failed to fetch recipes');
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="admin-recipe-overview">
            <AdminHeader />
            <div className="admin-recipe-container">
                <div>Loading...</div>
            </div>
        </div>
    );

    if (error) return (
        <div className="admin-recipe-overview">
            <AdminHeader />
            <div className="admin-recipe-container">
                <div className="error-message">{error}</div>
            </div>
        </div>
    );

    return (
        <div className="admin-recipe-overview">
            <AdminHeader />
            <div className="admin-recipe-container">
                <h1>Recipe Overview</h1>

                <div className="admin-recipes-controls">
                    <div className="admin-search-box">
                        <FaSearch className="admin-search-icon" />
                        <input
                            type="text"
                            placeholder="Search recipes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="admin-search-input"
                        />
                    </div>

                    <div className="admin-filter-controls">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="admin-sort-select"
                        >
                            <option value="latest">Latest</option>
                            <option value="oldest">Oldest</option>
                            <option value="rating">Highest Rated</option>
                        </select>

                        <select
                            value={cuisine}
                            onChange={(e) => setCuisine(e.target.value)}
                            className="admin-cuisine-select"
                        >
                            <option value="All">All Cuisines</option>
                            <option value="Italian">Italian</option>
                            <option value="Chinese">Chinese</option>
                            <option value="Mexican">Mexican</option>
                            <option value="Japanese">Japanese</option>
                            <option value="Indian">Indian</option>
                            <option value="Thai">Thai</option>
                            <option value="French">French</option>
                            <option value="Mediterranean">Mediterranean</option>
                            <option value="American">American</option>
                            <option value="Korean">Korean</option>
                        </select>
                    </div>
                </div>

                <div className="admin-recipe-grid">
                    {recipes.map((recipe) => (
                        <div key={recipe._id} className="admin-recipe-card">
                            <div className="admin-recipe-image-container">
                                <img
                                    src={recipe.image_url.startsWith('http') 
                                        ? recipe.image_url 
                                        : `${API_BASE_URL}${recipe.image_url}`}
                                    alt={recipe.title}
                                    className="admin-recipe-image"
                                />
                                <div className="admin-recipe-overlay">
                                    <Link 
                                        to={`/recipes/${recipe._id}`} 
                                        className="admin-view-recipe-link"
                                    >
                                        View Recipe
                                    </Link>
                                    <Link 
                                        to={`/admin/recipes/${recipe._id}/manage`} 
                                        className="admin-manage-recipe-link"
                                    >
                                        Manage Recipe
                                    </Link>
                                </div>
                            </div>
                            <div className="admin-recipe-content">
                                <h3>{recipe.title}</h3>
                                <p className="admin-recipe-description">{recipe.description}</p>
                                <div className="admin-recipe-info">
                                    <span>
                                        <FaHourglassHalf className="icon" />
                                        {recipe.prep_time}m prep
                                    </span>
                                    <span>
                                        <FaClock className="icon" />
                                        {recipe.cooking_time}m cook
                                    </span>
                                    <span>
                                        <FaUtensils className="icon" />
                                        {recipe.servings} servings
                                    </span>
                                </div>
                                <div className="recipe-stats">
                                    <span>
                                        <FaStar className="icon" />
                                        {recipe.averageRating.toFixed(1)} ({recipe.totalRatings})
                                    </span>
                                    <span>
                                        <FaComment className="icon" />
                                        {recipe.totalComments} comments
                                    </span>
                                </div>
                                <div className="recipe-meta">
                                    <span>By {recipe.author.username}</span>
                                    <span>{new Date(recipe.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RecipeOverview;
