import React from 'react';
import { render, screen } from '@testing-library/react';
import BookDetails from '../BookDetails';

test('renders BookDetails component', () => {
  const book = { title: 'Test Book', author: 'Test Author' };
  render(<BookDetails book={book} />);
  expect(screen.getByText(/Test Book/i)).toBeInTheDocument();
});
