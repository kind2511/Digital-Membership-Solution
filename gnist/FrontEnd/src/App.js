import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import HomePage from './components/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const auth0Domain = process.env.REACT_APP_AUTH0_DOMAIN;
  const auth0ClientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

  return (
    <Auth0Provider
      domain={auth0Domain}
      clientId={auth0ClientId}
      authorizationParams={{ redirect_uri: window.location.origin }} 
    >
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user-dashbaord"element={<UserDashboard />} />
          <Route path="/user-dashbaord"element={<AdminDashboard />} />
        </Routes>
      </Router>
    </Auth0Provider>
  );
}

export default App;
