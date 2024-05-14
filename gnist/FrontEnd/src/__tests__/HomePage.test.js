import React from 'react';
import renderer from 'react-test-renderer';
import HomePage from '../components/HomePage';
import { Auth0Context } from '@auth0/auth0-react';
import { MemoryRouter } from 'react-router-dom';

// Mock Auth0 Context
const mockAuth0Context = {
  loginWithRedirect: jest.fn(),
};

test('HomePage component snapshot', () => {
  const component = renderer.create(
    <Auth0Context.Provider value={mockAuth0Context}>
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    </Auth0Context.Provider>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
