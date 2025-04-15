import React, { useState, useEffect, useCallback } from 'react';
import './Dashboard.css';

const QuestionsManagement = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    options: [{ id: 1, text: '', correct: false }],
    type: 'Multiple Choice',
    difficulty: 'Medium',
    category: 'General'
  });
  const [addError, setAddError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use useCallback to memoize the fetchQuestions function
  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/questions');
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform the API data to match our component's expected format
      // Adding placeholder values for fields not in the API response
      const transformedData = data.map(question => ({
        id: question.id,
        text: question.text,
        options: question.options || [],
        type: determineQuestionType(question),
        difficulty: question.difficulty || 'Medium', // Default difficulty if not provided by API
        category: question.category || 'General', // Default category if not provided by API
      }));
      
      setQuestions(transformedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('Failed to load questions. Please try again later.');
      // Fall back to sample data if API fails
      setQuestions([
        { 
          id: 1, 
          text: 'What is the capital of France?', 
          type: 'Multiple Choice',
          difficulty: 'Easy',
          category: 'Geography',
          options: [
            { id: 1, text: 'London', correct: false },
            { id: 2, text: 'Paris', correct: true },
            { id: 3, text: 'Berlin', correct: false },
            { id: 4, text: 'Madrid', correct: false }
          ]
        },
        { 
          id: 2, 
          text: 'Which of the following is NOT a JavaScript framework?', 
          type: 'Multiple Choice',
          difficulty: 'Medium',
          category: 'Programming',
          options: []
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies as it doesn't rely on any props or state

  useEffect(() => {
    // Fetch questions from the API when component mounts
    fetchQuestions();
  }, [fetchQuestions]); // Add fetchQuestions as a dependency

  // Helper function to determine question type based on its structure
  const determineQuestionType = (question) => {
    if (question.options && question.options.length > 0) {
      // Check if multiple options can be correct
      const correctOptions = question.options.filter(option => option.correct);
      if (correctOptions.length > 1) {
        return 'Multiple Answer';
      }
      return 'Multiple Choice';
    }
    
    // If no options, assume it's an essay or short answer question
    if (question.text && question.text.length > 100) {
      return 'Essay';
    }
    
    return 'Short Answer';
  };

  // Filter questions based on search term and filters
  const filteredQuestions = questions.filter(question => {
    const matchesSearch = 
      question.text.toLowerCase().includes(searchTerm.toLowerCase()) || 
      question.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || question.type.toLowerCase().includes(typeFilter.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || question.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesDifficulty = difficultyFilter === 'all' || question.difficulty.toLowerCase() === difficultyFilter.toLowerCase();
    
    return matchesSearch && matchesType && matchesCategory && matchesDifficulty;
  });

  const handleViewOptions = (question) => {
    setSelectedQuestion(question);
    setShowOptionsModal(true);
  };

  const closeOptionsModal = () => {
    setShowOptionsModal(false);
    setSelectedQuestion(null);
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAddError(null);

    try {
      const response = await fetch('http://localhost:8080/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: 0, // API will assign the actual ID
          text: newQuestion.text,
          options: newQuestion.options
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create question. Status: ${response.status}`);
      }

      // Refresh the questions list
      await fetchQuestions();
      
      // Reset form and close modal
      setNewQuestion({
        text: '',
        options: [{ id: 1, text: '', correct: false }],
        type: 'Multiple Choice',
        difficulty: 'Medium',
        category: 'General'
      });
      setShowAddModal(false);
    } catch (err) {
      setAddError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOptionChange = (index, field, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = {
      ...updatedOptions[index],
      [field]: value
    };
    setNewQuestion({
      ...newQuestion,
      options: updatedOptions
    });
  };

  const addOption = () => {
    setNewQuestion({
      ...newQuestion,
      options: [
        ...newQuestion.options,
        {
          id: newQuestion.options.length + 1,
          text: '',
          correct: false
        }
      ]
    });
  };

  const removeOption = (index) => {
    const updatedOptions = newQuestion.options.filter((_, i) => i !== index);
    setNewQuestion({
      ...newQuestion,
      options: updatedOptions
    });
  };

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <h2>Manage Questions</h2>
        <button className="action-button" onClick={() => setShowAddModal(true)}>+ Add New Question</button>
      </div>
      
      <div className="search-filter">
        <input 
          type="text" 
          placeholder="Search questions..." 
          className="search-input" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          className="filter-select"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="multiple choice">Multiple Choice</option>
          <option value="multiple answer">Multiple Answer</option>
          <option value="essay">Essay</option>
          <option value="short">Short Answer</option>
        </select>
        <select 
          className="filter-select"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="programming">Programming</option>
          <option value="mathematics">Mathematics</option>
          <option value="geography">Geography</option>
          <option value="astronomy">Astronomy</option>
          <option value="general">General</option>
        </select>
        <select 
          className="filter-select"
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
        >
          <option value="all">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      
      {loading ? (
        <div className="loading-indicator">Loading questions...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <div className="table-container">
            <table className="data-table questions-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Question</th>
                  <th>Type</th>
                  <th>Difficulty</th>
                  <th>Category</th>
                  <th>Options</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuestions.length > 0 ? (
                  filteredQuestions.map(question => (
                    <tr key={question.id}>
                      <td>{question.id}</td>
                      <td className="question-text">{question.text}</td>
                      <td>{question.type}</td>
                      <td>
                        <span className={`difficulty-badge ${question.difficulty.toLowerCase()}`}>
                          {question.difficulty}
                        </span>
                      </td>
                      <td>{question.category}</td>
                      <td>
                        {question.options && question.options.length > 0 ? (
                          <button 
                            className="icon-button view"
                            onClick={() => handleViewOptions(question)}
                          >
                            View Options ({question.options.length})
                          </button>
                        ) : (
                          <span className="no-options">No options</span>
                        )}
                      </td>
                      <td className="actions-cell">
                        <button className="icon-button view">View</button>
                        <button className="icon-button edit">Edit</button>
                        <button className="icon-button delete">Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-data">No questions found matching your criteria</td>
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

      {/* Add Question Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => !isSubmitting && setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Question</h3>
              <button 
                className="modal-close" 
                onClick={() => !isSubmitting && setShowAddModal(false)}
                disabled={isSubmitting}
              >×</button>
            </div>
            <form onSubmit={handleAddQuestion}>
              <div className="modal-body">
                {addError && <div className="error-message">{addError}</div>}
                
                <div className="form-group">
                  <label htmlFor="questionText">Question Text *</label>
                  <textarea
                    id="questionText"
                    value={newQuestion.text}
                    onChange={(e) => setNewQuestion({...newQuestion, text: e.target.value})}
                    required
                    rows="3"
                    className="form-control"
                    placeholder="Enter your question"
                  />
                </div>

                <div className="form-group">
                  <label>Options</label>
                  {newQuestion.options.map((option, index) => (
                    <div key={index} className="option-input-group">
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="form-control"
                        required
                      />
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={option.correct}
                          onChange={(e) => handleOptionChange(index, 'correct', e.target.checked)}
                        />
                        Correct
                      </label>
                      {newQuestion.options.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                          className="icon-button delete"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addOption}
                    className="action-button secondary"
                  >
                    + Add Option
                  </button>
                </div>

                <div className="form-group">
                  <label htmlFor="difficulty">Difficulty</label>
                  <select
                    id="difficulty"
                    value={newQuestion.difficulty}
                    onChange={(e) => setNewQuestion({...newQuestion, difficulty: e.target.value})}
                    className="form-control"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    value={newQuestion.category}
                    onChange={(e) => setNewQuestion({...newQuestion, category: e.target.value})}
                    className="form-control"
                  >
                    <option value="General">General</option>
                    <option value="Programming">Programming</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Geography">Geography</option>
                    <option value="Astronomy">Astronomy</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="action-button secondary"
                  onClick={() => !isSubmitting && setShowAddModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="action-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Adding...' : 'Add Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for viewing question options */}
      {showOptionsModal && selectedQuestion && (
        <div className="modal-overlay" onClick={closeOptionsModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Question Options</h3>
              <button className="modal-close" onClick={closeOptionsModal}>×</button>
            </div>
            <div className="modal-body">
              <p className="question-text-full">{selectedQuestion.text}</p>
              <div className="options-list">
                {selectedQuestion.options.map(option => (
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
            <div className="modal-footer">
              <button className="action-button" onClick={closeOptionsModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionsManagement; 