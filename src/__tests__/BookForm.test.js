import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BookForm from '../BookForm';

test('renders BookForm component', () => {
  render(<BookForm />);
  expect(screen.getByText(/Save/i)).toBeInTheDocument();
});

test('handles input change', () => {
  render(<BookForm />);
  const input = screen.getByLabelText(/Title/i);
  fireEvent.change(input, { target: { value: 'New Title' } });
  expect(input.value).toBe('New Title');
});
