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
import UserInfo from './components/UserInfo';

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
        <Route path="/user-info" element={<ProtectedRoute component={UserInfo} />} />
      </Routes>
    </Router>
  );
}

export default App;

/*
 *Conditional rendering of the HomePage based on the user's authentication status and profile completion.
 */
function HomePageWithRedirection() {
  const { isAuthenticated, user, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // TODO: here must apply if the user complete his info register

      const userProfileComplete = false;

      // Extract the role from the user's data, set by your Auth0 Rules
      const role = user['https://my-namespace/role'];

      // Redirect based on the user's profile completeness and role
      if (!userProfileComplete) {
        // If the user's profile is not complete so redirect them to the UserInfo page
        navigate('/user-info');
      } else if (role === 'admin') {
        // If the user is an admin, redirect them to the Admin Dashboard
        navigate('/admin-dashboard');
      } else {
        // If the user is not an admin and their profile is complete, redirect to the User Dashboard
        navigate('/user-dashboard');
      }
    }
  }, [isAuthenticated, isLoading, navigate, user]);

  // If the user is loading or not authenticated, show the HomePage component!!!!!!!!!!!!!
  return isLoading ? <Loading /> : <HomePage />;
}
