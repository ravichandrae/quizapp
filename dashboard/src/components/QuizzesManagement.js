import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const QuizzesManagement = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/quizzes');
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      setQuizzes(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching quizzes:', err);
      setError('Failed to load quizzes. Please try again later.');
      // Fall back to empty array if API fails
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setShowQuizModal(true);
  };

  const closeQuizModal = () => {
    setShowQuizModal(false);
    setSelectedQuiz(null);
  };

  // Filter quizzes based on search term and status
  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = 
      quiz.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.questions.some(q => q.text.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'completed' && quiz.completed) ||
      (statusFilter === 'incomplete' && !quiz.completed);
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <h2>Manage Quizzes</h2>
        <button className="action-button">+ Create New Quiz</button>
      </div>
      
      <div className="search-filter">
        <input 
          type="text" 
          placeholder="Search quizzes..." 
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
        </select>
      </div>
      
      {loading ? (
        <div className="loading-indicator">Loading quizzes...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <div className="table-container">
            <table className="data-table quizzes-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Questions</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuizzes.length > 0 ? (
                  filteredQuizzes.map(quiz => (
                    <tr key={quiz.id}>
                      <td>{quiz.id}</td>
                      <td>
                        <div className="user-info">
                          <div>{quiz.user.name}</div>
                          <div className="user-email">{quiz.user.email}</div>
                        </div>
                      </td>
                      <td>{quiz.questions.length}</td>
                      <td>
                        <span className={`status-badge ${quiz.completed ? 'completed' : 'incomplete'}`}>
                          {quiz.completed ? 'Completed' : 'Incomplete'}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button 
                          className="icon-button view"
                          onClick={() => handleViewQuiz(quiz)}
                        >
                          View
                        </button>
                        <button className="icon-button delete">Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-data">No quizzes found matching your criteria</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="pagination">
            <button className="pagination-button">Previous</button>
            <span className="pagination-info">Page 1 of 1</span>
            <button className="pagination-button">Next</button>
          </div>
        </>
      )}

      {/* Quiz Details Modal */}
      {showQuizModal && selectedQuiz && (
        <div className="modal-overlay" onClick={closeQuizModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Quiz Details</h3>
              <button className="modal-close" onClick={closeQuizModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="quiz-user-info">
                <h4>User Information</h4>
                <p><strong>Name:</strong> {selectedQuiz.user.name}</p>
                <p><strong>Email:</strong> {selectedQuiz.user.email}</p>
                <p><strong>Mobile:</strong> {selectedQuiz.user.mobile}</p>
                <p><strong>School:</strong> {selectedQuiz.user.school || 'N/A'}</p>
              </div>
              
              <div className="quiz-questions">
                <h4>Questions</h4>
                {selectedQuiz.questions.map((question, index) => (
                  <div key={question.id} className="quiz-question">
                    <p className="question-number">Question {index + 1}</p>
                    <p className="question-text">{question.text}</p>
                    <div className="options-list">
                      {question.options.map(option => (
                        <div 
                          key={option.id} 
                          className={`option-item ${option.correct ? 'correct' : ''}`}
                        >
                          <span className="option-text">{option.text}</span>
                          {option.correct && <span className="correct-badge">Correct</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="action-button" onClick={closeQuizModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizzesManagement; 