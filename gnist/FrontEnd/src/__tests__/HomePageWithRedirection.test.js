import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import { Auth0Context } from '@auth0/auth0-react';
import HomePageWithRedirection from '../components/HomePageWithRedirection';
import HomePage from '../components/HomePage';
import Loading from '../components/Loading';

// Mock child components
jest.mock('../components/HomePage', () => () => <div>HomePage Component</div>);
jest.mock('../components/Loading', () => () => <div>Loading Component</div>);

// Mock Auth0 context
const mockAuth0Context = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
};

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ registered: false }),
  })
);

test('HomePageWithRedirection component snapshot', () => {
  const component = renderer.create(
    <Auth0Context.Provider value={mockAuth0Context}>
      <MemoryRouter>
        <HomePageWithRedirection />
      </MemoryRouter>
    </Auth0Context.Provider>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
