import React, { useState } from 'react';
import './StartScreen.css'; // We'll create this file next

const StartScreen = ({ onStart }) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && mobile.trim()) {
      onStart({ name, mobile });
    } else {
      alert('Please enter both name and mobile number');
    }
  };

  return (
    <div className="start-screen">
      <div className="start-screen-content">
        <h2>Welcome to the Quiz</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
          <button type="submit" className="start-button">Start Quiz</button>
        </form>
      </div>
    </div>
  );
};

export default StartScreen;