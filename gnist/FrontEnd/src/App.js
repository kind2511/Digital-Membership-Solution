import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import HomePage from './components/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  // TODO: will be replaced with domain and client ID later
  const auth0Domain = "****_AUTH0_DOMAIN";
  const auth0ClientId = "****_AUTH0_CLIENT_ID";

  return (
    <Auth0Provider
      domain={auth0Domain}
      clientId={auth0ClientId}
      redirectUri={window.location.origin}
    >
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </Auth0Provider>
  );
}

export default App;
