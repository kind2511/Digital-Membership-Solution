import React from 'react';
import renderer, { act } from 'react-test-renderer';
import Tilstede from '../components/Tilstede';
import axios from 'axios';

// Mock axios for testing
jest.mock('axios');

const mockData = {
  members_present: [
    { name: 'John Doe', profile_pic: '/path/to/john.jpg' },
    { name: 'Jane Smith', profile_pic: '/path/to/jane.jpg' }
  ],
  attendance_by_gender: {
    gutt: 5,
    jente: 7,
    "ikke-binær": 2,
    "vil ikke si": 1
  },
  total_attendance: 15
};

beforeEach(() => {
  axios.get.mockResolvedValueOnce({ data: mockData });
});

test('Tilstede component snapshot', async () => {
  let component;

  await act(async () => {
    component = renderer.create(<Tilstede />);
  });

  expect(component.toJSON()).toMatchSnapshot();
});
