import React from 'react';
import './Question.css';

const Question = ({ questionData, onAnswer, timeLeft }) => {
  const handleOptionClick = (optionId) => {
    onAnswer(optionId);
  };

  return (
    <div className="question-container">
      <div className="question-content">
        <h2>{questionData.text}</h2>
        <div className="timer">Time left: {timeLeft} seconds</div>
        <ul className="options-list">
          {questionData.options.map((option) => (
            <li key={option.id}>
              <button onClick={() => handleOptionClick(option.id)}>
                {option.text}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Question;