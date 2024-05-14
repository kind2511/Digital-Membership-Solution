import React from 'react';
import renderer from 'react-test-renderer';
import ProtectedRoute from '../components/ProtectedRoute';
import Loading from '../components/Loading';
import { Auth0Context } from '@auth0/auth0-react';

// Mock the Loading component
jest.mock('../components/Loading', () => () => <div>Loading...</div>);

// Mock a sample component to be protected
const MockComponent = () => <div>Mock Component</div>;

// Helper function to create a tree with given Auth0 context values
const createTree = (auth0ContextValues, props) => {
  return renderer.create(
    <Auth0Context.Provider value={auth0ContextValues}>
      <ProtectedRoute component={MockComponent} {...props} />
    </Auth0Context.Provider>
  ).toJSON();
};

test('ProtectedRoute renders loading state', () => {
  const tree = createTree({ isLoading: true });
  expect(tree).toMatchSnapshot();
});

test('ProtectedRoute handles error state', () => {
  const tree = createTree({ isLoading: false, error: { message: 'Something went wrong' } });
  expect(tree).toMatchSnapshot();
});

test('ProtectedRoute redirects when not authenticated', () => {
  const mockLoginWithRedirect = jest.fn();
  const tree = createTree({ isLoading: false, isAuthenticated: false, loginWithRedirect: mockLoginWithRedirect });
  expect(tree).toMatchSnapshot();
  expect(mockLoginWithRedirect).toHaveBeenCalled();
});

test('ProtectedRoute renders component when authenticated', () => {
  const tree = createTree({ isLoading: false, isAuthenticated: true });
  expect(tree).toMatchSnapshot();
});
