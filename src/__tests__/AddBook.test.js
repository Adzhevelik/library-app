import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddBook from '../AddBook';

test('renders AddBook component', () => {
  render(<AddBook />);
  expect(screen.getByText(/Add Book/i)).toBeInTheDocument();
});

test('handles form submission', () => {
  const mockOnSubmit = jest.fn();
  render(<AddBook onSubmit={mockOnSubmit} />);
  fireEvent.click(screen.getByText(/Submit/i));
  expect(mockOnSubmit).toHaveBeenCalled();
});
