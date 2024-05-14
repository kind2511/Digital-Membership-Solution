import React from 'react';
import renderer from 'react-test-renderer';
import LastOppBevis from '../components/LastOppBevis';
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
const certificatesMock = [
  {
    certificateID: 1,
    certificate_name: 'Certificate 1',
    certificate_image: '/path/to/certificate1.jpg'
  },
  {
    certificateID: 2,
    certificate_name: 'Certificate 2',
    certificate_image: '/path/to/certificate2.jpg'
  }
];

mock.onGet('http://127.0.0.1:8000/digital_medlemsordning/search_member/?name=').reply(200, membersMock);
mock.onGet('http://127.0.0.1:8000/digital_medlemsordning/get_member_certificates/auth0|123456789/').reply(200, certificatesMock);
mock.onDelete('http://127.0.0.1:8000/digital_medlemsordning/delete_member_certificate/1/').reply(200);
mock.onDelete('http://127.0.0.1:8000/digital_medlemsordning/delete_member_certificate/2/').reply(200);

test('LastOppBevis component snapshot', () => {
  const component = renderer.create(<LastOppBevis />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
