import React from 'react';
import renderer from 'react-test-renderer';
import Bevis from '../components/Bevis';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Auth0Context } from '@auth0/auth0-react';

// Mock axios for the test
const mock = new MockAdapter(axios);
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
mock.onGet('http://localhost:8000/digital_medlemsordning/get_member_certificates/auth0|123456789/').reply(200, certificatesMock);

// Mock Auth0 Context
const mockAuth0Context = {
  user: { sub: 'auth0|123456789' },
  getAccessTokenSilently: jest.fn().mockResolvedValue('fake-token')
};

test('Bevis component snapshot', () => {
  const component = renderer.create(
    <Auth0Context.Provider value={mockAuth0Context}>
      <Bevis />
    </Auth0Context.Provider>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
