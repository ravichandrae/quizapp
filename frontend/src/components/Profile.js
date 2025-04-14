import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="profile-container">
      <h2 className="profile-title">My Profile</h2>
      
      {userData && (
        <div className="profile-details">
          <div className="profile-card">
            <div className="profile-avatar">
              <div className="avatar-placeholder">
                {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
            <div className="profile-info">
              <p><strong>Name:</strong> {userData.name}</p>
              <p><strong>Mobile:</strong> {userData.mobile}</p>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>School:</strong> {userData.school || 'Not specified'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile; 