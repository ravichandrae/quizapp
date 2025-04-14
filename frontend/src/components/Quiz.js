import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Quiz.css';

const Quiz = () => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [questionCount, setQuestionCount] = useState(3);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch sample quiz for user with ID 1
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          `http://localhost:8080/api/quizzes/user/1/sample?questionCount=${questionCount}`
        );
        setQuiz(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load quiz. Please try again.');
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [questionCount]);

  // Timer for each question
  useEffect(() => {
    if (!quiz || quizCompleted) return;
    
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
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setTimeLeft(15);
    setQuizCompleted(false);
    setLoading(true);
    
    // Fetch a new quiz
    const fetchQuiz = async () => {
      try {
        const response = await axios.post(
          `http://localhost:8080/api/quizzes/user/1/sample?questionCount=${questionCount}`
        );
        setQuiz(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load quiz. Please try again.');
        setLoading(false);
      }
    };

    fetchQuiz();
  };

  const handleQuestionCountChange = (e) => {
    setQuestionCount(e.target.value);
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
  if (!quiz) return <div className="quiz-container"><p>No quiz data available.</p></div>;

  return (
    <div className="quiz-container">
      {!quizCompleted ? (
        <>
          <div className="quiz-header">
            <h2>Sample Quiz</h2>
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
            <div className="question-count-control">
              <label htmlFor="questionCount">Number of Questions:</label>
              <select
                id="questionCount"
                value={questionCount}
                onChange={handleQuestionCountChange}
              >
                <option value="3">3</option>
                <option value="5">5</option>
                <option value="10">10</option>
              </select>
            </div>
            
            <button className="restart-btn" onClick={restartQuiz}>
              Take Another Quiz
            </button>
            
            <button className="home-btn" onClick={() => navigate('/profile')}>
              Back to Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz; 