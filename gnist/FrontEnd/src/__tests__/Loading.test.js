import React from 'react';
import renderer from 'react-test-renderer';
import Loading from '../components/Loading';

test('Loading component snapshot', () => {
  const component = renderer.create(<Loading />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
