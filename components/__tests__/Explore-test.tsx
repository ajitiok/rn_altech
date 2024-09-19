import React from 'react';
import { render } from '@testing-library/react-native';
import TabTwoScreen from '../../app/(tabs)/explore';

describe('TabTwoScreen', () => {
  it('renders correctly', () => {
    const { getByText } = render(<TabTwoScreen />);
    expect(getByText('Explore')).toBeTruthy();
    expect(getByText('This app uses the following technologies:')).toBeTruthy();
  });

  it('contains the correct number of collapsible sections', () => {
    const { getAllByText } = render(<TabTwoScreen />);
    const collapsibleSections = getAllByText(/Technologies Used/i);
    expect(collapsibleSections.length).toBe(1);
  });
});