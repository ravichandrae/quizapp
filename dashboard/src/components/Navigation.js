import React, { useState } from 'react';
import './Navigation.css';

const Navigation = ({ onMenuSelect }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const handleMenuClick = (menuItem) => {
    setActiveMenu(menuItem);
    if (onMenuSelect) {
      onMenuSelect(menuItem);
    }
  };

  return (
    <nav className="dashboard-nav">
      <ul className="nav-menu">
        <li 
          className={`nav-item ${activeMenu === 'dashboard' ? 'active' : ''}`}
          onClick={() => handleMenuClick('dashboard')}
        >
          <i className="nav-icon dashboard-icon"></i>
          <span>Dashboard</span>
        </li>
        <li 
          className={`nav-item ${activeMenu === 'users' ? 'active' : ''}`}
          onClick={() => handleMenuClick('users')}
        >
          <i className="nav-icon users-icon"></i>
          <span>Manage Users</span>
        </li>
        <li 
          className={`nav-item ${activeMenu === 'questions' ? 'active' : ''}`}
          onClick={() => handleMenuClick('questions')}
        >
          <i className="nav-icon questions-icon"></i>
          <span>Manage Questions</span>
        </li>
        <li 
          className={`nav-item ${activeMenu === 'quizzes' ? 'active' : ''}`}
          onClick={() => handleMenuClick('quizzes')}
        >
          <i className="nav-icon quizzes-icon"></i>
          <span>Manage Quizzes</span>
        </li>
        <li 
          className={`nav-item ${activeMenu === 'results' ? 'active' : ''}`}
          onClick={() => handleMenuClick('results')}
        >
          <i className="nav-icon results-icon"></i>
          <span>View Results</span>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation; 