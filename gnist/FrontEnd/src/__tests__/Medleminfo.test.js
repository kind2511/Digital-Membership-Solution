import React from 'react';
import renderer from 'react-test-renderer';
import Medleminfo from '../components/Medleminfo';

// Mock the child components
jest.mock('../components/EndeligGodkjenning', () => () => <div>EndeligGodkjenning Component</div>);
jest.mock('../components/MedlemsNivaer', () => () => <div>MedlemsNivaer Component</div>);
jest.mock('../components/Forslag', () => () => <div>Forslag Component</div>);
jest.mock('../components/LastOppBevis', () => () => <div>LastOppBevis Component</div>);
jest.mock('../components/EkstraInfoOmMedlem', () => () => <div>EkstraInfoOmMedlem Component</div>);
jest.mock('../components/EndretMedlemsPoen', () => () => <div>EndretMedlemsPoen Component</div>);
jest.mock('../components/LeggTilEkstraInfoOmMedlem', () => () => <div>LeggTilEkstraInfoOmMedlem Component</div>);

test('Medleminfo component snapshot', () => {
  const component = renderer.create(<Medleminfo />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
