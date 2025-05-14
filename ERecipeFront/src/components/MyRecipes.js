import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaStar, FaClock, FaUtensils, FaHourglassHalf, FaSearch, FaEdit } from 'react-icons/fa';
import axios from 'axios';
import './MyRecipes.css';
import Header from './Header';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [cuisine, setCuisine] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const cuisineOptions = ['All', 'Italian', 'Mexican', 'Indian', 'American'];

  const fetchMyRecipes = useCallback(async () => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      if (!userId || !token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/myrecipes`, {
        params: {
          userId,
          search: searchTerm,
          sortBy,
          cuisine
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data) {
        setRecipes(response.data);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, sortBy, cuisine, navigate]);

  useEffect(() => {
    fetchMyRecipes();
  }, [fetchMyRecipes]);

  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url}`;
  };

  const RecipeCard = ({ recipe }) => (
    <div className="recipe-card">
      <div className="recipe-image-container">
        <img 
          src={getImageUrl(recipe.image_url)} 
          alt={recipe.title} 
          className="recipe-image" 
        />
        <div className="recipe-overlay">
          <div className="recipe-buttons">
            <Link to={`/recipes/${recipe._id}`} className="view-recipe-btn">
              View Recipe
            </Link>
            <Link to={`/edit-recipe/${recipe._id}`} className="edit-recipe-btn">
              <FaEdit /> Edit Recipe
            </Link>
          </div>
        </div>
      </div>
      <div className="recipe-content">
        <h3>{recipe.title}</h3>
        <p className="recipe-description">{recipe.description}</p>
        
        <div className="recipe-info">
          <span className="cooking-info">
            <FaHourglassHalf className="icon" />
            {recipe.prep_time}m prep
          </span>
          <span className="cooking-info">
            <FaClock className="icon" />
            {recipe.cooking_time}m cook
          </span>
          <span className="cooking-info">
            <FaUtensils className="icon" />
            {recipe.servings} servings
          </span>
        </div>

        <div className="recipe-meta">
          <span className="recipe-cuisine">{recipe.cuisine}</span>
          <span className="recipe-rating">
            <FaStar className="icon" />
            {recipe.averageRating?.toFixed(1) || 'No ratings'}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <Header />
      <div className="recipes-page">
        <section className="hero-section">
          <h1>My Recipe Collection</h1>
          <p>Manage and explore your personal collection of delicious recipes</p>
        </section>

        <div className="recipes-container">
          <h1 className="page-title">My Recipes</h1>
          
          <div className="recipes-controls">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search my recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-controls">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
                <option value="rating">Highest Rated</option>
              </select>
              <select value={cuisine} onChange={(e) => setCuisine(e.target.value)} className="cuisine-select">
                {cuisineOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="loading">Loading recipes...</div>
          ) : recipes.length > 0 ? (
            <div className="recipe-grid">
              {recipes.map(recipe => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="no-results">No recipes found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyRecipes; 