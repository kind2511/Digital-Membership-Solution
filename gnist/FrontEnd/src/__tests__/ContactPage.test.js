import React from 'react';
import renderer from 'react-test-renderer';
import ContactPage from '../components/ContactPage';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSnapchatGhost, faInstagram, faTiktok } from '@fortawesome/free-brands-svg-icons';


library.add(faSnapchatGhost, faInstagram, faTiktok);

test('ContactPage component snapshot', () => {
  const component = renderer.create(<ContactPage />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
