import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import HomePage from './components/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import Loading from './components/Loading';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePageWithRedirection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/user-dashboard"
          element={<ProtectedRoute component={UserDashboard} />}
        />
        <Route
          path="/admin-dashboard"
          element={<ProtectedRoute component={AdminDashboard} />}
        />
      </Routes>
    </Router>
  );
}

function HomePageWithRedirection() {
  const { isAuthenticated, user, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const role = user['https://my-namespace/role']; // will be fixed by RULES 
      if (role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    }
  }, [isAuthenticated, isLoading, navigate, user]);

  return isLoading ? <Loading /> : <HomePage />;
}

export default App;
