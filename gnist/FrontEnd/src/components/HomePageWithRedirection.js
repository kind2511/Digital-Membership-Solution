import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import HomePage from './HomePage';
import Loading from './Loading';

function HomePageWithRedirection() {
  const { isAuthenticated, user, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
    
      const userProfileComplete = false; 

      // Extract the role from the user's data
      const role = user['https://my-namespace/role'];

      // Redirect based on the user's role and profile completeness
      if (!userProfileComplete) {
        navigate('/user-info');
      } else if (role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    }
  }, [isAuthenticated, isLoading, navigate, user]);

  return isLoading ? <Loading /> : <HomePage />;
}

export default HomePageWithRedirection;
