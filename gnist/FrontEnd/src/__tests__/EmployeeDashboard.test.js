import React from 'react';
import renderer from 'react-test-renderer';
import EmployeeDashboard from '../components/EmployeeDashboard';
import { Auth0Context } from '@auth0/auth0-react';

// Mock the child components
jest.mock('../components/Tilstede', () => () => <div>Tilstede Component</div>);
jest.mock('../components/Aktiviteter', () => () => <div>Aktiviteter Component</div>);
jest.mock('../components/Undersøkelser', () => () => <div>Undersøkelser Component</div>);
jest.mock('../components/Rød', () => () => <div>Rød Component</div>);
jest.mock('../components/Medleminfo', () => () => <div>Medleminfo Component</div>);
jest.mock('../components/FinnBruker', () => () => <div>FinnBruker Component</div>);

// Mock Auth0 Context
const mockAuth0Context = {
  user: { sub: 'auth0|123456789' },
  logout: jest.fn()
};

test('EmployeeDashboard component snapshot', () => {
  const component = renderer.create(
    <Auth0Context.Provider value={mockAuth0Context}>
      <EmployeeDashboard />
    </Auth0Context.Provider>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
