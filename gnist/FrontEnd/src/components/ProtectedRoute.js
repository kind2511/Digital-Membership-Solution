import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Loading from './Loading';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, isLoading, loginWithRedirect, error } = useAuth0();

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    // Handle the error state
    return <div>Oops... {error.message}</div>;
  }

  if (!isAuthenticated) {
    loginWithRedirect(); // Redirect to Auth0 login
    return <Loading />;
  }

  return Component ? <Component {...rest} /> : null; // Render nothing if no component is provided
};

export default ProtectedRoute;
