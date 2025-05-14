import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const [username, setUsername] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve username from local storage if the user is logged in
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/recipes?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm(''); // Clear search after navigation
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <header className="header">
      <div className="logo-container">
        <img src="/images/logo.png" alt="Recipe Hub Logo" className="logo" />
      </div>

      <div className="search-container">
        <FaSearch className="search-icon" />
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search recipes..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div>

      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/recipes">Recipes</Link>
        <Link to="/about">About Us</Link>
        {username && (
          <>
            <Link to="/myrecipes">My Recipes</Link>
            <Link to="/addrecipe" className="share-recipe-link">Add Recipe</Link>
          </>
        )}
        
        {username ? (
          <Link to="/profile" className="username-display">Welcome, {username}</Link>
        ) : (
          <Link to="/login" className="login-link">Login</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
