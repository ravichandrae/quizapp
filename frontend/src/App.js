import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import Quiz from './components/Quiz';
import AssignedQuizzes from './components/AssignedQuizzes';
import AssignedQuiz from './components/AssignedQuiz';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected routes with Layout */}
          <Route path="/profile" element={
            <PrivateRoute>
              <Layout>
                <Profile />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/quiz" element={
            <PrivateRoute>
              <Layout>
                <Quiz />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/assigned-quizzes" element={
            <PrivateRoute>
              <Layout>
                <AssignedQuizzes />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/assigned-quiz/:quizId" element={
            <PrivateRoute>
              <Layout>
                <AssignedQuiz />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 