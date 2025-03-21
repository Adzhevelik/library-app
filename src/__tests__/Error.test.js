import React from 'react';
import { render, screen } from '@testing-library/react';
import Error from '../Error';

test('renders Error component', () => {
  render(<Error />);
  expect(screen.getByText(/Error/i)).toBeInTheDocument();
});
