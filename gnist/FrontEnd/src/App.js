import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import UserInfo from './components/UserInfo';
import HomePageWithRedirection from './components/HomePageWithRedirection';
import ContactPage from './components/ContactPage'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePageWithRedirection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user-dashboard" element={<ProtectedRoute component={UserDashboard} />} />
        <Route path="/admin-dashboard" element={<ProtectedRoute component={AdminDashboard} />} />
        <Route path="/employee-dashboard" element={<ProtectedRoute component={EmployeeDashboard} />} />
        <Route path="/user-info" element={<ProtectedRoute component={UserInfo} />} />
        <Route path="/kontakt-oss" element={<ContactPage />} /> 
      </Routes>
    </Router>
  );
}

export default App;
