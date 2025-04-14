import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import Quiz from './components/Quiz';
import AssignedQuizzes from './components/AssignedQuizzes';
import AssignedQuiz from './components/AssignedQuiz';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="/quiz" element={
            <PrivateRoute>
              <Quiz />
            </PrivateRoute>
          } />
          <Route path="/assigned-quizzes" element={
            <PrivateRoute>
              <AssignedQuizzes />
            </PrivateRoute>
          } />
          <Route path="/assigned-quiz/:quizId" element={
            <PrivateRoute>
              <AssignedQuiz />
            </PrivateRoute>
          } />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 