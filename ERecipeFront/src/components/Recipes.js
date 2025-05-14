import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { FaStar, FaClock, FaUtensils, FaHourglassHalf, FaSearch, FaHeart } from 'react-icons/fa';
import axios from 'axios';
import './Recipes.css';
import Header from './Header';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Recipes = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('latest');
  const [cuisine, setCuisine] = useState('All');
  const [showFavorites, setShowFavorites] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const cuisineOptions = ['All', 'Italian', 'Mexican', 'Indian', 'American'];

  const fetchRecipes = useCallback(async () => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem('userId');

      if (showFavorites && !userId) {
        navigate('/login');
        return;
      }

      let response;
      if (showFavorites && userId) {
        // Fetch favorite recipes with full recipe details
        response = await axios.get(`${API_BASE_URL}/api/recipes`, {
          params: {
            userId: userId,
            favorites: 'true'
          }
        });
        setRecipes(response.data || []);
      } else {
        // Fetch regular recipes with filters
        response = await axios.get(`${API_BASE_URL}/api/recipes`, {
          params: {
            search: searchTerm,
            sortBy: sortBy,
            cuisine: cuisine
          }
        });
        setRecipes(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, sortBy, cuisine, showFavorites, navigate]);

  useEffect(() => {
    const urlSearchTerm = searchParams.get('search');
    if (urlSearchTerm) {
      setSearchTerm(urlSearchTerm);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value) {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
    }
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleCuisineChange = (e) => {
    setCuisine(e.target.value);
  };

  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url}`;
  };

  const RecipeCard = ({ recipe }) => {
    const [isFavorited, setIsFavorited] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
      // Don't do anything if recipe is invalid
      if (!recipe || !recipe._id) {
        return;
      }

      const checkFavoriteStatus = async () => {
        try {
          const userId = localStorage.getItem('userId');
          if (!userId) return;

          const response = await axios.get(
            `${API_BASE_URL}/api/favorites/check/${recipe._id}`,
            { params: { userId } }
          );
          setIsFavorited(response.data.isFavorited);
        } catch (error) {
          console.error('Error checking favorite status:', error);
        }
      };

      checkFavoriteStatus();
    }, [recipe?._id]); // Use optional chaining here

    // Move null check here, after all hooks
    if (!recipe || !recipe._id) {
      return null;
    }

    const handleFavoriteClick = async (e) => {
      e.preventDefault(); // Prevent navigation
      e.stopPropagation(); // Prevent card click event
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          navigate('/login');
          return;
        }

        if (isFavorited) {
          await axios.delete(`${API_BASE_URL}/api/favorites/remove`, {
            data: { user_id: userId, recipe_id: recipe._id }
          });
        } else {
          await axios.post(`${API_BASE_URL}/api/favorites/add`, {
            user_id: userId,
            recipe_id: recipe._id
          });
        }
        setIsFavorited(!isFavorited);
      } catch (error) {
        console.error('Error toggling favorite:', error);
      }
    };

    return (
      <div className="recipe-card">
        <div className="recipe-image-container">
          <img 
            src={getImageUrl(recipe.image_url)} 
            alt={recipe.title} 
            className="recipe-image" 
          />
          <div className="recipe-overlay">
            <Link to={`/recipes/${recipe._id}`} className="view-recipe-btn">
              View Recipe
            </Link>
          </div>
          <button 
            onClick={handleFavoriteClick}
            className={`favorite-btn ${isFavorited ? 'favorited' : ''}`}
          >
            <FaHeart />
          </button>
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
  };

  return (
    <div>
      <Header />
      <div className="recipes-page">
        <section className="hero-section">
          <h1>Explore Our Recipes</h1>
          <p>Find your next favorite dish from our collection of delicious recipes</p>
        </section>

        <div className="recipes-container">
          <div className="recipes-controls">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
              />
            </div>
            <div className="filter-controls">
              <select value={sortBy} onChange={handleSortChange} className="sort-select">
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
                <option value="rating">Highest Rated</option>
              </select>
              <select value={cuisine} onChange={handleCuisineChange} className="cuisine-select">
                {cuisineOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <button 
                className={`favorite-filter-btn ${showFavorites ? 'active' : ''}`}
                onClick={() => setShowFavorites(!showFavorites)}
              >
                <FaHeart /> {showFavorites ? 'All Recipes' : 'My Favorites'}
              </button>
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
            <div className="no-results">
              {showFavorites ? "You haven't favorited any recipes yet" : "No recipes found"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recipes;
