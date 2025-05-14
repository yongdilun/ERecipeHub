import React from 'react';
import Header from './Header';
import './AboutUs.css';
import { FaHeart, FaUtensils, FaUsers, FaLeaf } from 'react-icons/fa';

const AboutUs = () => {
  return (
    <div>
      <Header />
      <div className="about-container">
        <div className="about-header">
          <h1>About Recipe Hub</h1>
          <p>Bringing healthy and delicious recipes to your kitchen</p>
        </div>

        <div className="about-content">
          <div className="mission-section">
            <h2>Our Mission</h2>
            <p>
              At Recipe Hub, we believe that healthy eating should be enjoyable and accessible to everyone. 
              Our platform is dedicated to sharing nutritious recipes that don't compromise on taste.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <FaHeart className="feature-icon" />
              <h3>Healthy Living</h3>
              <p>We promote balanced nutrition and wholesome ingredients for a healthier lifestyle.</p>
            </div>

            <div className="feature-card">
              <FaUtensils className="feature-icon" />
              <h3>Easy Cooking</h3>
              <p>Our recipes are designed to be simple to follow, making cooking enjoyable for everyone.</p>
            </div>

            <div className="feature-card">
              <FaUsers className="feature-icon" />
              <h3>Community</h3>
              <p>Join our growing community of food enthusiasts sharing their culinary experiences.</p>
            </div>

            <div className="feature-card">
              <FaLeaf className="feature-icon" />
              <h3>Fresh Ingredients</h3>
              <p>We emphasize the use of fresh, seasonal ingredients in our recipes.</p>
            </div>
          </div>

          <div className="values-section">
            <h2>Our Values</h2>
            <ul>
              <li>Promoting healthy eating habits</li>
              <li>Making cooking accessible and enjoyable</li>
              <li>Building a supportive culinary community</li>
              <li>Encouraging sustainable food practices</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs; 