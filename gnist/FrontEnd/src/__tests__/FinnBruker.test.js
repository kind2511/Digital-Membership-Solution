import React from 'react';
import renderer from 'react-test-renderer';
import FinnBruker from '../components/FinnBruker';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Mock axios for the test
const mock = new MockAdapter(axios);
const usersMock = [
  {
    auth0ID: 'auth0|123456789',
    first_name: 'John',
    last_name: 'Doe',
    birthdate: '2000-01-01',
    gender: 'Male',
    email: 'john.doe@example.com',
    phone_number: '12345678',
    guardian_name: 'Jane Doe',
    guardian_phone: '87654321',
    verified: true,
    banned: false,
    banned_from: null,
    banned_until: null,
    info: 'Some extra info about John Doe'
  },
  {
    auth0ID: 'auth0|987654321',
    first_name: 'Jane',
    last_name: 'Doe',
    birthdate: '2002-02-02',
    gender: 'Female',
    email: 'jane.doe@example.com',
    phone_number: '87654321',
    guardian_name: null,
    guardian_phone: null,
    verified: false,
    banned: true,
    banned_from: '2023-01-01',
    banned_until: '2023-12-31',
    info: 'Some extra info about Jane Doe'
  }
];
mock.onGet('http://127.0.0.1:8000/digital_medlemsordning/search_member/?name=').reply(200, usersMock);

test('FinnBruker component snapshot', () => {
  const component = renderer.create(<FinnBruker />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
