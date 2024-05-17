import React from 'react';
import renderer from 'react-test-renderer';
import TodayActivitiesComponent from '../components/TodayActivitiesComponent';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Auth0Context } from '@auth0/auth0-react';

// Mock axios for the test
const mock = new MockAdapter(axios);
mock.onGet('http://127.0.0.1:8000/digital_medlemsordning/get_activity_today/').reply(200, []);

// Mock Auth0 Context
const mockAuth0Context = {
  user: { sub: 'auth0|123456789' },
  isAuthenticated: true,
  loginWithRedirect: jest.fn(),
  logout: jest.fn()
};

test('TodayActivitiesComponent snapshot', () => {
  const component = renderer.create(
    <Auth0Context.Provider value={mockAuth0Context}>
      <TodayActivitiesComponent />
    </Auth0Context.Provider>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
