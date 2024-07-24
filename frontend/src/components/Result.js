import React from 'react';
import './Result.css';

const Result = ({ score, totalQuestions, studentInfo }) => {
  return (
    <div className="result-container">
      <div className="result-content">
        <h2>Quiz Completed!</h2>
        <div className="student-info">
          <p><strong>Name:</strong> {studentInfo.name}</p>
          <p><strong>Mobile:</strong> {studentInfo.mobile}</p>
          <p><strong>Email:</strong> {studentInfo.email}</p>
        </div>
        <div className="score-info">
          <p>Your score:</p>
          <p className="score">{score} out of {totalQuestions}</p>
        </div>
      </div>
    </div>
  );
};

export default Result;