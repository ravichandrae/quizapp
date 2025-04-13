import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching profile data');
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const startQuiz = () => {
    navigate('/quiz');
  };

  const viewAssignedQuizzes = () => {
    navigate('/assigned-quizzes');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      {userData && (
        <div className="profile-details">
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Mobile:</strong> {userData.mobile}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>School:</strong> {userData.school || 'Not specified'}</p>
        </div>
      )}
      
      <div className="profile-actions">
        <button onClick={viewAssignedQuizzes} className="quiz-button">
          View Assigned Quizzes
        </button>
        
        <button onClick={startQuiz} className="quiz-button">
          Take a Sample Quiz
        </button>
        
        <button onClick={handleLogout} className="logout-button">
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Profile; 