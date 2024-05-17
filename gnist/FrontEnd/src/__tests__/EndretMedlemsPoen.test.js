import React from 'react';
import renderer from 'react-test-renderer';
import EndretMedlemsPoen from '../components/EndretMedlemsPoen';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Mock axios for the test
const mock = new MockAdapter(axios);
const membersMock = [
  {
    auth0ID: 'auth0|123456789',
    first_name: 'John',
    last_name: 'Doe',
    points: 100
  },
  {
    auth0ID: 'auth0|987654321',
    first_name: 'Jane',
    last_name: 'Doe',
    points: 200
  }
];
mock.onGet('http://127.0.0.1:8000/digital_medlemsordning/search_member/?name=').reply(200, membersMock);

test('EndretMedlemsPoen component snapshot', () => {
  const component = renderer.create(<EndretMedlemsPoen />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
