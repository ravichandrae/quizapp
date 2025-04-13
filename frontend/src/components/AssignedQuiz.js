import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Quiz.css'; // Reuse quiz styling

const AssignedQuiz = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch assigned quiz by ID
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/api/quizzes/user/1`);
        const foundQuiz = response.data.find(q => q.id === parseInt(quizId));
        
        if (foundQuiz) {
          setQuiz(foundQuiz);
          setQuizCompleted(foundQuiz.completed);
        } else {
          setError('Quiz not found');
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load quiz. Please try again.');
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  // Timer for each question
  useEffect(() => {
    if (!quiz || quizCompleted || quiz.completed) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up for current question
          handleTimeUp();
          return 15; // Reset for next question
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, quiz, quizCompleted]);

  const handleTimeUp = () => {
    // Move to next question without adding score if time is up
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setTimeLeft(15); // Reset timer
    } else {
      // Quiz completed
      finishQuiz();
    }
  };

  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId);
    
    // Check if correct answer
    const currentQuestion = quiz.questions[currentQuestionIndex];
    const selectedOpt = currentQuestion.options.find(opt => opt.id === optionId);
    
    if (selectedOpt.correct) {
      setScore(score + 1);
    }
    
    // Move to next question after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < quiz.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
        setTimeLeft(15); // Reset timer
      } else {
        // Quiz completed
        finishQuiz();
      }
    }, 1000);
  };

  const finishQuiz = () => {
    setQuizCompleted(true);
    
    // Here you would typically send a POST request to update the quiz status to completed
    // For example:
    // axios.post(`http://localhost:8080/api/quizzes/${quizId}/complete`, { score });
  };

  const getOptionClassName = (option) => {
    if (selectedOption === null) return "option-btn";
    if (selectedOption === option.id) {
      return `option-btn ${option.correct ? "correct" : "incorrect"}`;
    }
    if (selectedOption !== null && option.correct) {
      return "option-btn correct";
    }
    return "option-btn";
  };

  if (loading) return <div className="quiz-container"><p>Loading quiz...</p></div>;
  if (error) return <div className="quiz-container"><p className="error">{error}</p></div>;
  if (!quiz) return <div className="quiz-container"><p>Quiz not found.</p></div>;

  return (
    <div className="quiz-container">
      {quiz.completed ? (
        <div className="quiz-results">
          <h2>Quiz Already Completed</h2>
          <p>You have already completed this quiz.</p>
          <button 
            className="home-btn" 
            onClick={() => navigate('/assigned-quizzes')}
          >
            Back to Assigned Quizzes
          </button>
        </div>
      ) : !quizCompleted ? (
        <>
          <div className="quiz-header">
            <h2>Quiz #{quiz.id}</h2>
            <div className="quiz-info">
              <p>Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>
              <p className={timeLeft <= 5 ? "timer-warning" : "timer"}>
                Time Left: {timeLeft}s
              </p>
              <p>Score: {score}</p>
            </div>
          </div>
          
          <div className="question-container">
            <h3>{quiz.questions[currentQuestionIndex].text}</h3>
            <div className="options-container">
              {quiz.questions[currentQuestionIndex].options.map((option) => (
                <button
                  key={option.id}
                  className={getOptionClassName(option)}
                  onClick={() => handleOptionSelect(option.id)}
                  disabled={selectedOption !== null}
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="quiz-results">
          <h2>Quiz Completed!</h2>
          <p>Your Score: {score} out of {quiz.questions.length}</p>
          <p>Percentage: {Math.round((score / quiz.questions.length) * 100)}%</p>
          
          <div className="quiz-controls">
            <button 
              className="home-btn" 
              onClick={() => navigate('/assigned-quizzes')}
            >
              Back to Assigned Quizzes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignedQuiz; 