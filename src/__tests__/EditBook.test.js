import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EditBook from '../EditBook';

test('renders EditBook component', () => {
  const book = { id: 1, title: 'Book 1' };
  render(<EditBook book={book} />);
  expect(screen.getByText(/Edit Book/i)).toBeInTheDocument();
});

test('handles form submission', () => {
  const mockOnSubmit = jest.fn();
  const book = { id: 1, title: 'Book 1' };
  render(<EditBook book={book} onSubmit={mockOnSubmit} />);
  fireEvent.click(screen.getByText(/Save/i));
  expect(mockOnSubmit).toHaveBeenCalled();
});
