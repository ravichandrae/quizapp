import React from 'react';
import './Question.css';

const Question = ({ questionData, onAnswer, timeLeft }) => {
  const handleOptionClick = (optionText) => {
    onAnswer(optionText);
  };

  return (
    <div className="question-container">
      <div className="question-content">
        <h2>{questionData.question.questionText}</h2>
        <div className="timer">Time left: {timeLeft} seconds</div>
        <ul className="options-list">
          {questionData.options.map((option) => (
            <li key={option.optionId}>
              <button onClick={() => handleOptionClick(option.optionText)}>
                {option.optionText}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Question;