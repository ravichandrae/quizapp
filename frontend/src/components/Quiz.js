import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Question from './Question';
import Result from './Result';
import StartScreen from './StartScreen';
import './Quiz.css';

const QUESTION_TIMEOUT = 15; // 15 seconds per question

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [quizState, setQuizState] = useState('start');
  const [studentInfo, setStudentInfo] = useState(null);
  const [finalScore, setFinalScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIMEOUT);

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    let timer;
    if (quizState === 'quiz' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      handleAnswer('');
    }
    return () => clearTimeout(timer);
  }, [quizState, timeLeft]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/quiz');
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleStartQuiz = (info) => {
    setStudentInfo(info);
    setQuizState('quiz');
    setTimeLeft(QUESTION_TIMEOUT);
  };

  const handleAnswer = (answer) => {
    const newAnswer = {
      question: questions[currentQuestionIndex].question,
      answer: answer
    };
    setAnswers(prevAnswers => [...prevAnswers, newAnswer]);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setTimeLeft(QUESTION_TIMEOUT);
    } else {
      submitQuiz([...answers, newAnswer]);
    }
  };

  const submitQuiz = async (finalAnswers) => {
    try {
      const response = await axios.post('http://localhost:8080/api/quiz', finalAnswers);
      setFinalScore(response.data.score);
      setQuizState('result');
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('There was an error submitting your quiz. Please try again.');
    }
  };

  return (
    <div className="quiz-container">
      {quizState === 'start' && <StartScreen onStart={handleStartQuiz} />}
      {quizState === 'quiz' && questions.length > 0 && (
        <div className="quiz-content">
          <div className="progress-bar">
            <div 
              className="progress" 
              style={{width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`}}
            ></div>
          </div>
          <Question
            key={currentQuestionIndex}
            questionData={questions[currentQuestionIndex]}
            onAnswer={handleAnswer}
            timeLeft={timeLeft}
          />
          <div className="question-counter">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>
      )}
      {quizState === 'result' && 
        <Result 
          score={finalScore} 
          totalQuestions={questions.length} 
          studentInfo={studentInfo} 
        />
      }
    </div>
  );
};

export default Quiz;