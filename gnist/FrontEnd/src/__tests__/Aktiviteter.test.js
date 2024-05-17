import React from 'react';
import renderer from 'react-test-renderer';
import Aktiviteter from '../components/Aktiviteter';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Mock axios for the test
const mock = new MockAdapter(axios);
mock.onGet('http://127.0.0.1:8000/digital_medlemsordning/get_future_activities/').reply(200, []);
mock.onGet('http://127.0.0.1:8000/digital_medlemsordning/get_past_activities/').reply(200, []);

test('Aktiviteter component snapshot', () => {
  const component = renderer.create(<Aktiviteter />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
