import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DeleteBookModal from '../DeleteBookModal';

test('renders DeleteBookModal component', () => {
  render(<DeleteBookModal />);
  expect(screen.getByText(/Delete Book/i)).toBeInTheDocument();
});

test('handles delete confirmation', () => {
  const mockOnConfirm = jest.fn();
  render(<DeleteBookModal onConfirm={mockOnConfirm} />);
  fireEvent.click(screen.getByText(/Confirm/i));
  expect(mockOnConfirm).toHaveBeenCalled();
});
