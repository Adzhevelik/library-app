import React from 'react';
import { render, screen } from '@testing-library/react';
import BookList from '../BookList';

test('renders BookList component', () => {
  const books = [{ id: 1, title: 'Book 1' }, { id: 2, title: 'Book 2' }];
  render(<BookList books={books} />);
  expect(screen.getByText(/Book 1/i)).toBeInTheDocument();
});
