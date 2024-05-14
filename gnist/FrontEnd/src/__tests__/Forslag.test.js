import React from 'react';
import renderer from 'react-test-renderer';
import Forslag from '../components/Forslag';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Mock axios for the test
const mock = new MockAdapter(axios);
const suggestionsMock = [
  {
    suggestionID: 1,
    title: 'Suggestion 1',
    description: 'Description for suggestion 1'
  },
  {
    suggestionID: 2,
    title: 'Suggestion 2',
    description: 'Description for suggestion 2'
  }
];
mock.onGet('http://127.0.0.1:8000/digital_medlemsordning/get_all_suggestions/').reply(200, suggestionsMock);

test('Forslag component snapshot', () => {
  const component = renderer.create(<Forslag />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
