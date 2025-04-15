import React from 'react';
import './Dashboard.css';

const DashboardHome = () => {
  return (
    <div className="dashboard-section">
      <h2>Dashboard Overview</h2>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Users</h3>
          <div className="stat-value">42</div>
        </div>
        <div className="stat-card">
          <h3>Total Questions</h3>
          <div className="stat-value">156</div>
        </div>
        <div className="stat-card">
          <h3>Active Quizzes</h3>
          <div className="stat-value">8</div>
        </div>
        <div className="stat-card">
          <h3>Completed Quizzes</h3>
          <div className="stat-value">127</div>
        </div>
      </div>
      <div className="dashboard-recent">
        <div className="recent-section">
          <h3>Recent Activity</h3>
          <ul className="activity-list">
            <li>User John Doe completed Quiz #12</li>
            <li>Admin added 5 new questions to Question Bank</li>
            <li>New Quiz "JavaScript Basics" created</li>
            <li>User Jane Smith registered</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome; 