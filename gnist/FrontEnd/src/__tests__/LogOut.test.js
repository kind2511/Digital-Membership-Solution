import React from 'react';
import renderer from 'react-test-renderer';
import { Auth0Context } from '@auth0/auth0-react';
import LogOut from '../components/LogOut';

// Mock Auth0 context
const mockAuth0Context = {
  logout: jest.fn(),
};

test('LogOut component snapshot', () => {
  const component = renderer.create(
    <Auth0Context.Provider value={mockAuth0Context}>
      <LogOut />
    </Auth0Context.Provider>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
