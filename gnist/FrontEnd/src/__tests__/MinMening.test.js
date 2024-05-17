import React from 'react';
import renderer from 'react-test-renderer';
import MinMening from '../components/MinMening';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Auth0Context } from '@auth0/auth0-react';

// Mock axios for the test
const mock = new MockAdapter(axios);
const questionsMock = [
  { questionID: 1, question: 'What is your favorite color?', answers: [{ answer_id: 1, answer_text: 'Red' }, { answer_id: 2, answer_text: 'Blue' }] },
  { questionID: 2, question: 'What is your favorite animal?', answers: [{ answer_id: 3, answer_text: 'Dog' }, { answer_id: 4, answer_text: 'Cat' }] },
];

mock.onGet('http://localhost:8000/digital_medlemsordning/get_all_questions').reply(200, { questions: questionsMock });
mock.onPost('http://localhost:8000/digital_medlemsordning/create_suggestion/').reply(201);
mock.onPost(/http:\/\/localhost:8000\/digital_medlemsordning\/submit_response\/.*/).reply(201);

// Mock Auth0 context
const mockAuth0Context = {
  getAccessTokenSilently: jest.fn().mockResolvedValue('mocked_token'),
  user: { sub: 'auth0|123456789' },
};

test('MinMening component snapshot', () => {
  const component = renderer.create(
    <Auth0Context.Provider value={mockAuth0Context}>
      <MinMening />
    </Auth0Context.Provider>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
