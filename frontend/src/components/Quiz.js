import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Question from './Question';
import Result from './Result';
import StartScreen from './StartScreen';
import './Quiz.css';

const QUESTION_TIMEOUT = 15; // 15 seconds per question

const Quiz = () => {
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [quizState, setQuizState] = useState('start');
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIMEOUT);
  const [quizResult, setQuizResult] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    let timer;
    if (quizState === 'quiz' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      handleAnswer(null);
    }
    return () => clearTimeout(timer);
  }, [quizState, timeLeft]);

  const fetchQuiz = async (userId) => {
    try {
      const response = await axios.post(`http://localhost:8080/api/quizzes?userId=${userId}&questionCount=1`);
      setQuizData(response.data);
      setQuizState('quiz');
      setTimeLeft(QUESTION_TIMEOUT);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      alert('Error fetching quiz. Please try again.');
      setQuizState('start');
    }
  };

  const handleStartQuiz = (userDetails) => {
    setUserData(userDetails);
    fetchQuiz(userDetails.id);
  };

  const handleAnswer = (optionId) => {
    console.log('Answer selected:', optionId);
    setAnswers(prevAnswers => {
      const newAnswers = [...prevAnswers, optionId];
      console.log('Updated answers:', newAnswers);
      return newAnswers;
    });
    
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setTimeLeft(QUESTION_TIMEOUT);
    } else {
      console.log('Quiz finished, submitting answers');
      submitQuiz([...answers, optionId]);
    }
  };

  const submitQuiz = async (finalAnswers) => {
    console.log('Submitting quiz with answers:', finalAnswers);
    try {
      const response = await axios.post(`http://localhost:8080/api/quiz-results/${quizData.id}/submit`, finalAnswers);
      console.log('Quiz submission response:', response.data);
      setQuizResult(response.data);
      setQuizState('result');
      // Force re-render
      setCurrentQuestionIndex(0);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('There was an error submitting your quiz. Please try again.');
    }
  };

  return (
    <div className="quiz-container">
      {quizState === 'start' && <StartScreen onStart={handleStartQuiz} />}
      {quizState === 'quiz' && quizData && (
        <div className="quiz-content">
          <div className="progress-bar">
            <div 
              className="progress" 
              style={{width: `${((currentQuestionIndex + 1) / quizData.questions.length) * 100}%`}}
            ></div>
          </div>
          <Question
            key={currentQuestionIndex}
            questionData={quizData.questions[currentQuestionIndex]}
            onAnswer={handleAnswer}
            timeLeft={timeLeft}
          />
          <div className="question-counter">
            Question {currentQuestionIndex + 1} of {quizData.questions.length}
          </div>
        </div>
      )}
      {quizState === 'result' && quizResult && 
        <Result 
          score={quizResult.score}
          totalQuestions={quizResult.totalQuestions}
          studentInfo={userData}
        />
      }
    </div>
  );
};

export default Quiz;