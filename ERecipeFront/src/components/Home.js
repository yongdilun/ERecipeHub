import React, { useState, useEffect } from 'react';
import Header from './Header';
import { FaStar, FaClock, FaUtensils, FaHourglassHalf, FaArrowRight, FaChevronLeft, FaChevronRight, FaHeart } from 'react-icons/fa';
import axios from 'axios';
import './Home.css';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Home = () => {
  const [recipes, setRecipes] = useState({
    latestRecipes: [],
    topRatedRecipes: []
  });
  const [currentLatestIndex, setCurrentLatestIndex] = useState(0);
  const [currentTopRatedIndex, setCurrentTopRatedIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        console.log('Fetching from:', `${API_BASE_URL}/api/home`);
        const response = await axios.get(`${API_BASE_URL}/api/home`);
        console.log('Response:', response.data);
        
        if (response.data && response.data.data) {
          setRecipes(response.data.data);
        } else {
          console.error('Invalid response format:', response.data);
          setRecipes({ latestRecipes: [], topRatedRecipes: [] });
        }
      } catch (error) {
        console.error('Error fetching recipes:', error.response || error);
        setRecipes({ latestRecipes: [], topRatedRecipes: [] });
      }
    };

    fetchRecipes();
  }, []);

  const RecipeCard = ({ recipe, type }) => {
    const [isFavorited, setIsFavorited] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
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
    }, [recipe._id]);

    const handleFavoriteClick = async (e) => {
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

    // Format date helper function
    const formatDate = (dateString) => {
      if (!dateString) return 'No date';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      
      // Format date as "MM/DD/YYYY" or use any preferred format
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    const getImageUrl = (url) => {
      if (!url) return '';
      if (url.startsWith('http')) return url;
      return `${API_BASE_URL}${url}`;
    };

    return (
      <div className="recipe-card" onClick={() => navigate(`/recipes/${recipe._id}`)}>
        <div className="recipe-image-container">
          <img 
            src={getImageUrl(recipe.image_url)} 
            alt={recipe.title} 
            className="recipe-image" 
          />
          <div className="recipe-overlay">
            <button className="view-recipe-btn">
              View Recipe <FaArrowRight className="arrow-icon" />
            </button>
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
            <span className="recipe-author">By {recipe.author.username}</span>
            {type === 'rated' && (
              <span className="recipe-rating">
                <FaStar className="icon star-icon" />
                {recipe.averageRating?.toFixed(1) || 0}
              </span>
            )}
            {type === 'latest' && (
              <span className="recipe-time">
                <FaClock className="icon clock-icon" />
                {formatDate(recipe.created_at)}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const getVisibleRecipes = (recipeList, startIndex) => {
    return recipeList.slice(startIndex, startIndex + 3);
  };

  const handleNavigation = (direction, section) => {
    const container = document.querySelector(`.${section === 'latest' ? 'latest-recipes' : 'top-rated-recipes'} .recipe-grid`);
    
    if (container) {
      container.classList.remove('slide-left', 'slide-right', 'slide-from-left', 'slide-from-right');
      
      void container.offsetWidth;
      
      container.classList.add(direction === 'next' ? 'slide-left' : 'slide-right');
      
      setTimeout(() => {
        if (section === 'latest') {
          setCurrentLatestIndex(prev => {
            const newIndex = direction === 'next' ? prev + 3 : prev - 3;
            return Math.max(0, Math.min(newIndex, recipes.latestRecipes.length - 3));
          });
        } else {
          setCurrentTopRatedIndex(prev => {
            const newIndex = direction === 'next' ? prev + 3 : prev - 3;
            return Math.max(0, Math.min(newIndex, recipes.topRatedRecipes.length - 3));
          });
        }
        
        void container.offsetWidth;
        
        container.classList.remove('slide-left', 'slide-right');
        container.classList.add(direction === 'next' ? 'slide-from-right' : 'slide-from-left');
        
        setTimeout(() => {
          container.classList.remove('slide-from-right', 'slide-from-left');
        }, 300);
      }, 300);
    }
  };

  const NavigationButton = ({ direction, onClick, disabled }) => (
    <button 
      className={`nav-button ${disabled ? 'nav-button-disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={`${direction} recipes`}
    >
      {direction === 'prev' ? (
        <FaChevronLeft aria-hidden="true" />
      ) : (
        <FaChevronRight aria-hidden="true" />
      )}
    </button>
  );

  return (
    <div className="recipe-hub">
      <Header />
      <main className="home-content">
        <section className="hero-section">
          <h1>Discover Amazing Recipes</h1>
          <p>Explore our collection of delicious recipes shared by food enthusiasts</p>
        </section>

        <section className="latest-recipes">
          <div className="section-header">
            <h2>Latest Recipes</h2>
            <button className="view-all-btn" onClick={() => navigate('/recipes')}>
              View All <FaArrowRight />
            </button>
          </div>
          <div className="recipe-section-container">
            <NavigationButton 
              direction="prev"
              onClick={() => handleNavigation('prev', 'latest')}
              disabled={currentLatestIndex === 0}
            />
            <div className="recipe-grid">
              {getVisibleRecipes(recipes.latestRecipes, currentLatestIndex).map(recipe => (
                <RecipeCard key={recipe._id} recipe={recipe} type="latest" />
              ))}
            </div>
            <NavigationButton 
              direction="next"
              onClick={() => handleNavigation('next', 'latest')}
              disabled={currentLatestIndex >= recipes.latestRecipes.length - 3}
            />
          </div>
        </section>

        <section className="top-rated-recipes">
          <div className="section-header">
            <h2>Top Rated Recipes</h2>
            <button className="view-all-btn" onClick={() => navigate('/recipes')}>
              View All <FaArrowRight />
            </button>
          </div>
          <div className="recipe-section-container">
            <NavigationButton 
              direction="prev"
              onClick={() => handleNavigation('prev', 'rated')}
              disabled={currentTopRatedIndex === 0}
            />
            <div className="recipe-grid">
              {getVisibleRecipes(recipes.topRatedRecipes, currentTopRatedIndex).map(recipe => (
                <RecipeCard key={recipe._id} recipe={recipe} type="rated" />
              ))}
            </div>
            <NavigationButton 
              direction="next"
              onClick={() => handleNavigation('next', 'rated')}
              disabled={currentTopRatedIndex >= recipes.topRatedRecipes.length - 3}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
