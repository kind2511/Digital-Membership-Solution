import React from 'react';
import renderer from 'react-test-renderer';
import EkstraInfoOmMedlem from '../components/EkstraInfoOmMedlem';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Mock axios for the test
const mock = new MockAdapter(axios);
const membersMock = [
  {
    auth0ID: 'auth0|123456789',
    first_name: 'John',
    last_name: 'Doe',
    info: 'Some additional info about John Doe'
  },
  {
    auth0ID: 'auth0|987654321',
    first_name: 'Jane',
    last_name: 'Doe',
    info: 'Some additional info about Jane Doe'
  }
];
mock.onGet('http://127.0.0.1:8000/digital_medlemsordning/get_members_with_info/').reply(200, membersMock);

test('EkstraInfoOmMedlem component snapshot', () => {
  const component = renderer.create(<EkstraInfoOmMedlem />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
