import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  return (
    <div className="nav-sidebar">
      <div className="nav-logo">
        <h2>Quiz App</h2>
      </div>
      <nav className="nav-menu">
        <NavLink 
          to="/profile" 
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
        >
          <i className="nav-icon profile-icon"></i>
          <span>Profile</span>
        </NavLink>
        <NavLink 
          to="/quiz" 
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
        >
          <i className="nav-icon quiz-icon"></i>
          <span>Take Sample Test</span>
        </NavLink>
        <NavLink 
          to="/assigned-quizzes" 
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
        >
          <i className="nav-icon assigned-icon"></i>
          <span>Assigned Quizzes</span>
        </NavLink>
        
        <div className="nav-spacer"></div>
        
        <button onClick={handleLogout} className="nav-link logout-link">
          <i className="nav-icon logout-icon"></i>
          <span>Sign Out</span>
        </button>
      </nav>
    </div>
  );
};

export default Navigation; 