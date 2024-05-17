import React from 'react';
import renderer from 'react-test-renderer';
import RegistrationStatus from '../components/RegistrationStatus';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Mock axios for the test
const mock = new MockAdapter(axios);

const baseApiUrl = 'http://localhost:8000';
const userSub = 'auth0|123456789';
const endpoint = `${baseApiUrl}/digital_medlemsordning/add_day/${userSub}/`;

mock.onPost(endpoint).reply(200);

const defaultProps = {
  userSub,
  isRegistered: false,
  setIsRegistered: jest.fn(),
};

const createTree = (props) => {
  return renderer.create(<RegistrationStatus {...props} />).toJSON();
};

test('RegistrationStatus component snapshot - default state', () => {
  const tree = createTree(defaultProps);
  expect(tree).toMatchSnapshot();
});

test('RegistrationStatus component snapshot - registered state', () => {
  const tree = createTree({ ...defaultProps, isRegistered: true });
  expect(tree).toMatchSnapshot();
});

test('RegistrationStatus component snapshot - with confirmation modal', () => {
  const component = renderer.create(<RegistrationStatus {...defaultProps} />);
  const instance = component.root;

  // Checkbox click
  const checkbox = instance.findByType('input');
  checkbox.props.onClick();

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
