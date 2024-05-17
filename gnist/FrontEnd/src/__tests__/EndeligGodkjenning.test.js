import React from 'react';
import renderer from 'react-test-renderer';
import EndeligGodkjenning from '../components/EndeligGodkjenning';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Mock axios for the test
const mock = new MockAdapter(axios);
const unverifiedMembersMock = [
  {
    userID: 1,
    auth0ID: 'auth0|123456789',
    first_name: 'John',
    last_name: 'Doe',
    birthdate: '2000-01-01',
    guardian_name: 'Jane Doe',
    guardian_phone: '12345678'
  },
  {
    userID: 2,
    auth0ID: 'auth0|987654321',
    first_name: 'Jane',
    last_name: 'Doe',
    birthdate: '2002-02-02',
    guardian_name: null,
    guardian_phone: null
  }
];
mock.onGet('http://127.0.0.1:8000/digital_medlemsordning/get_all_unverified_members/').reply(200, unverifiedMembersMock);

test('EndeligGodkjenning component snapshot', () => {
  const component = renderer.create(<EndeligGodkjenning />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
