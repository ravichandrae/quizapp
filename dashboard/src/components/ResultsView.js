import React from 'react';
import './Dashboard.css';

const ResultsView = () => {
  // Mock data - in a real app, this would come from an API
  const results = [
    { 
      id: 1, 
      user: 'John Doe',
      quiz: 'JavaScript Basics',
      score: '85%',
      timeTaken: '24 minutes',
      completedOn: '2023-03-12'
    },
    { 
      id: 2, 
      user: 'Jane Smith',
      quiz: 'World Geography',
      score: '92%',
      timeTaken: '38 minutes',
      completedOn: '2023-03-11'
    },
    { 
      id: 3, 
      user: 'Robert Johnson',
      quiz: 'Advanced Mathematics',
      score: '78%',
      timeTaken: '52 minutes',
      completedOn: '2023-03-10'
    },
    { 
      id: 4, 
      user: 'Emily Davis',
      quiz: 'Science Quiz',
      score: '90%',
      timeTaken: '35 minutes',
      completedOn: '2023-03-09'
    },
    { 
      id: 5, 
      user: 'Michael Wilson',
      quiz: 'JavaScript Basics',
      score: '72%',
      timeTaken: '28 minutes',
      completedOn: '2023-03-08'
    },
  ];

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <h2>Quiz Results</h2>
        <div className="header-actions">
          <button className="action-button secondary">Export to CSV</button>
          <button className="action-button secondary">Generate Report</button>
        </div>
      </div>
      
      <div className="search-filter">
        <input type="text" placeholder="Search results..." className="search-input" />
        <select className="filter-select">
          <option value="all">All Quizzes</option>
          <option value="js">JavaScript Basics</option>
          <option value="geo">World Geography</option>
          <option value="math">Advanced Mathematics</option>
          <option value="science">Science Quiz</option>
        </select>
        <input type="date" className="date-filter" />
      </div>
      
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Quiz</th>
              <th>Score</th>
              <th>Time Taken</th>
              <th>Completed On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.map(result => (
              <tr key={result.id}>
                <td>{result.id}</td>
                <td>{result.user}</td>
                <td>{result.quiz}</td>
                <td>
                  <span className={`score ${parseInt(result.score) >= 80 ? 'high' : parseInt(result.score) >= 60 ? 'medium' : 'low'}`}>
                    {result.score}
                  </span>
                </td>
                <td>{result.timeTaken}</td>
                <td>{result.completedOn}</td>
                <td className="actions-cell">
                  <button className="icon-button view">View Details</button>
                  <button className="icon-button download">Download</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="pagination">
        <button className="pagination-button">Previous</button>
        <span className="pagination-info">Page 1 of 1</span>
        <button className="pagination-button">Next</button>
      </div>
    </div>
  );
};

export default ResultsView; 