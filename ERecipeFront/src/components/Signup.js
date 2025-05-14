import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './AuthForm.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [passwordFeedback, setPasswordFeedback] = useState([]);
  const [signupSuccess, setSignupSuccess] = useState(false); // New state to track signup success
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setPasswordFeedback([]);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/signup`, { username, email, password });
      setMessage(response.data.message);
      setSignupSuccess(true); // Set signup success to true if signup was successful
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred. Please try again.');
      setSignupSuccess(false);

      if (error.response?.data?.reasons) {
        setPasswordFeedback(error.response.data.reasons);
      }
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url("/images/background.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backdropFilter: "blur(4px)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <div className="auth-form-container">
        <img src="/images/logo.png" alt="ERecipeHub Logo" className="logo" />
        <h2>Signup</h2>
        {message && <p className="message">{message}</p>}
        {passwordFeedback.length > 0 && (
          <ul className="password-feedback">
            {passwordFeedback.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}

        {!signupSuccess ? (
          <form onSubmit={handleSubmit}>
            <label>Username:</label>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label>Email:</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Password:</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Sign Up</button>
          </form>
        ) : (
          <div className="login-prompt">
            <p>Account created successfully! You can now log in.</p>
            <button onClick={() => navigate('/login')} className="login-button">
              Log in
            </button>
          </div>
        )}
        <p>
          Already have an account? <Link to="/login">Log in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
