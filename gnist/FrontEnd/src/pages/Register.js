import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Register = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div>
      <h2>Register Page</h2>
      <button onClick={() => loginWithRedirect({
        screen_hint: 'signup',
      })}>
        Register
      </button>
    </div>
  );
};

export default Register;
