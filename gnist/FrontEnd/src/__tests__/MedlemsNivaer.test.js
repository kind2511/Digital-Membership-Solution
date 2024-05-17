import React from 'react';
import renderer from 'react-test-renderer';
import MedlemsNivaer from '../components/MedlemsNivaer';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Mock axios for the test
const mock = new MockAdapter(axios);
const levelsMock = [
  { levelID: 1, name: 'Bronze', points: 100 },
  { levelID: 2, name: 'Silver', points: 200 },
  { levelID: 3, name: 'Gold', points: 300 }
];

mock.onGet('http://127.0.0.1:8000/digital_medlemsordning/get_all_levels/').reply(200, levelsMock);
mock.onPost('http://127.0.0.1:8000/digital_medlemsordning/create_level/').reply(201);
mock.onPut('http://127.0.0.1:8000/digital_medlemsordning/edit_level/1/').reply(200);
mock.onDelete('http://127.0.0.1:8000/digital_medlemsordning/delete_level/1/').reply(200);

test('MedlemsNivaer component snapshot', () => {
  const component = renderer.create(<MedlemsNivaer />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
