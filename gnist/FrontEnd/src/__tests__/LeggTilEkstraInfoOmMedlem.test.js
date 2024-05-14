import React from 'react';
import renderer from 'react-test-renderer';
import LeggTilEkstraInfoOmMedlem from '../components/LeggTilEkstraInfoOmMedlem';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Mock axios for the test
const mock = new MockAdapter(axios);
const membersMock = [
  {
    auth0ID: 'auth0|123456789',
    first_name: 'John',
    last_name: 'Doe'
  },
  {
    auth0ID: 'auth0|987654321',
    first_name: 'Jane',
    last_name: 'Doe'
  }
];

mock.onGet('http://127.0.0.1:8000/digital_medlemsordning/search_member/?name=').reply(200, membersMock);
mock.onPut('http://127.0.0.1:8000/digital_medlemsordning/add_member_info/auth0|123456789/').reply(200);

test('LeggTilEkstraInfoOmMedlem component snapshot', () => {
  const component = renderer.create(<LeggTilEkstraInfoOmMedlem />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
