import React, { useState } from 'react';
import axios from 'axios';
import './StartScreen.css';

const StartScreen = ({ onStart }) => {
  const [mobile, setMobile] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mobile.trim()) {
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:8080/api/users/${mobile}`);
        const userData = response.data;
        onStart(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        alert('Unable to find user. Please check the mobile number and try again.');
      } finally {
        setIsLoading(false);
      }
    } else {
      alert('Please enter a mobile number');
    }
  };

  return (
    <div className="start-screen">
      <div className="start-screen-content">
        <h2>Welcome to the Quiz</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="mobile">Mobile Number:</label>
            <input
              type="tel"
              id="mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="start-button" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Start Quiz'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StartScreen;