import React from 'react';
import renderer from 'react-test-renderer';
import ProgramComponent from '../components/ProgramComponent';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Auth0Context } from '@auth0/auth0-react';

// Mock axios for the test
const mock = new MockAdapter(axios);
const programsMock = [
  {
    activityID: 1,
    title: 'Sample Program 1',
    description: 'Description for Program 1',
    date: '2023-12-01',
    image: '/path/to/image1.jpg',
    signed_up_members: [],
  },
  {
    activityID: 2,
    title: 'Sample Program 2',
    description: 'Description for Program 2',
    date: '2023-12-15',
    image: '/path/to/image2.jpg',
    signed_up_members: [],
  },
];

mock.onGet('http://127.0.0.1:8000/digital_medlemsordning/get_future_activities/').reply(200, programsMock);
mock.onPost('http://127.0.0.1:8000/digital_medlemsordning/sign_up_activity/').reply(201);
mock.onPost('http://127.0.0.1:8000/digital_medlemsordning/undo_signup_activity/').reply(200);

// Mock Auth0 context
const mockAuth0Context = {
  isAuthenticated: true,
  user: { sub: 'auth0|123456789' },
  getAccessTokenSilently: jest.fn().mockResolvedValue('mocked_token'),
};

test('ProgramComponent component snapshot', () => {
  const component = renderer.create(
    <Auth0Context.Provider value={mockAuth0Context}>
      <ProgramComponent />
    </Auth0Context.Provider>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
