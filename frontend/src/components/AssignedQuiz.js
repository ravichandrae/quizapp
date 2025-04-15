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
  const [timeLeft, setTimeLeft] = useState(15);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submissionResult, setSubmissionResult] = useState(null);
  
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
    // Record -1 for the timed-out question
    setAnswers(prev => {
      const updatedAnswers = {
        ...prev,
        [currentQuestionIndex]: -1
      };
      
      // If this is the last question, finish the quiz after updating answers
      if (currentQuestionIndex >= quiz.questions.length - 1) {
        setTimeout(() => finishQuiz(updatedAnswers), 0);
      } else {
        // Move to the next question
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
        setTimeLeft(15); // Reset timer
      }
      
      return updatedAnswers;
    });
  };

  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId);
    
    // Store the answer for current question
    setAnswers(prev => {
      const updatedAnswers = {
        ...prev,
        [currentQuestionIndex]: optionId
      };
      
      // Move to next question after a short delay
      setTimeout(() => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedOption(null);
          setTimeLeft(15); // Reset timer
        } else {
          // If this is the last question, finish the quiz after updating answers
          finishQuiz(updatedAnswers);
        }
      }, 1000);
      
      return updatedAnswers;
    });
  };

  const finishQuiz = async (currentAnswers) => {
    setQuizCompleted(true);
    
    try {
      // Use the most recent answers that were passed in, or fall back to state
      const answersToSubmit = currentAnswers || answers;
      
      // Create an array of answers in question order
      const answerArray = [];
      
      // Make sure all questions have an answer (use -1 for unanswered)
      for (let i = 0; i < quiz.questions.length; i++) {
        const answer = answersToSubmit[i];
        answerArray.push(answer !== undefined ? answer : -1);
      }
      
      console.log("Submitting answers:", answerArray);
      
      // Submit answers to the evaluation API
      const response = await axios.post(
        `http://localhost:8080/api/quiz-results/${quizId}/submit`,
        answerArray
      );
      setSubmissionResult(response.data);
    } catch (err) {
      setError('Failed to submit quiz. Please try again.');
    }
  };

  const getOptionClassName = (option) => {
    if (selectedOption === null) return "option-btn";
    if (selectedOption === option.id) {
      return "option-btn selected";
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
          {submissionResult ? (
            <>
              <p>Your Score: {submissionResult.score} out of {submissionResult.totalQuestions}</p>
              <p>Percentage: {Math.round((submissionResult.score / submissionResult.totalQuestions) * 100)}%</p>
            </>
          ) : (
            <p>Submitting your answers...</p>
          )}
          
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