import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import UserInfo from './components/UserInfo';
import HomePageWithRedirection from './components/HomePageWithRedirection';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePageWithRedirection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user-dashboard" element={<ProtectedRoute component={UserDashboard} />} />
        <Route path="/admin-dashboard" element={<ProtectedRoute component={AdminDashboard} />} />
        <Route path="/user-info" element={<ProtectedRoute component={UserInfo} />} />
      </Routes>
    </Router>
  );
}

export default App;
