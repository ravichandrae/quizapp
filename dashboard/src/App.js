import React, { useState } from 'react';
import './App.css';
import Login from './components/Login';
import Navigation from './components/Navigation';
import DashboardHome from './components/DashboardHome';
import UsersManagement from './components/UsersManagement';
import QuestionsManagement from './components/QuestionsManagement';
import QuizzesManagement from './components/QuizzesManagement';
import ResultsView from './components/ResultsView';

function App() {
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');

  const handleLogin = (userData) => {
    // In a real app, you would store the user data in a more secure way
    // and possibly use a state management library like Redux
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleMenuSelect = (menuItem) => {
    setActiveSection(menuItem);
  };

  // Render the appropriate content based on the active section
  const renderContent = () => {
    switch (activeSection) {
      case 'users':
        return <UsersManagement />;
      case 'questions':
        return <QuestionsManagement />;
      case 'quizzes':
        return <QuizzesManagement />;
      case 'results':
        return <ResultsView />;
      case 'dashboard':
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="App">
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div className="dashboard">
          <header className="dashboard-header">
            <h1>Quiz Administrator Dashboard</h1>
            <div className="user-info">
              <span>Welcome, {user.username}</span>
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
          </header>
          <div className="dashboard-container">
            <Navigation onMenuSelect={handleMenuSelect} />
            <main className="dashboard-content">
              {renderContent()}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
