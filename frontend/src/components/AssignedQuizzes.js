import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AssignedQuizzes.css';

const AssignedQuizzes = () => {
  const [assignedQuizzes, setAssignedQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignedQuizzes();
  }, []);

  const fetchAssignedQuizzes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/quizzes/user/1');
      setAssignedQuizzes(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load assigned quizzes. Please try again.');
      setLoading(false);
    }
  };

  const handleStartQuiz = (quizId) => {
    navigate(`/assigned-quiz/${quizId}`);
  };

  const handleBackToProfile = () => {
    navigate('/profile');
  };

  if (loading) return <div className="loading-spinner">Loading assigned quizzes...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="quizzes-container">
      <h2 className="assigned-title">Your Assigned Quizzes</h2>
      
      {assignedQuizzes.length === 0 ? (
        <div className="no-quizzes">
          <p>You don't have any assigned quizzes at the moment.</p>
        </div>
      ) : (
        <div className="quizzes-list">
          {assignedQuizzes.map((quiz) => (
            <div key={quiz.id} className="quiz-card">
              <div className="quiz-info">
                <h3>Quiz #{quiz.id}</h3>
                
                <div className="quiz-details">
                  <div className="quiz-detail-item">
                    <span>Questions:</span> {quiz.questions.length}
                  </div>
                  
                  <div className="quiz-detail-item">
                    <span>Status:</span> 
                    <div className={`status-badge ${quiz.completed ? 'status-completed' : 'status-pending'}`}>
                      {quiz.completed ? 'Completed' : 'Not Completed'}
                    </div>
                  </div>
                </div>
                
                <p>Test your knowledge with this quiz consisting of {quiz.questions.length} questions.</p>
              </div>
              
              <div className="quiz-actions">
                <button 
                  onClick={() => handleStartQuiz(quiz.id)} 
                  className="start-quiz-btn"
                  disabled={quiz.completed}
                >
                  {quiz.completed ? 'View Results' : 'Start Quiz'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="actions">
        <button onClick={handleBackToProfile} className="back-btn">
          Back to Profile
        </button>
      </div>
    </div>
  );
};

export default AssignedQuizzes; 