import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BookCard from '../BookCard';

const mockBook = {
  id: '1',
  title: 'Test Book Title',
  author: 'Test Author',
  description: 'A short description.',
  genre: 'Fiction',
  availableCopies: 1,
  totalCopies: 2,
};

describe('BookCard Component', () => {
  test('renders book card with details', () => {
    const onDeleteMock = jest.fn();
    render(
      <MemoryRouter>
        <BookCard book={mockBook} onDelete={onDeleteMock} />
      </MemoryRouter>
    );
    expect(screen.getByText(mockBook.title)).toBeInTheDocument();
    expect(screen.getByText(`by ${mockBook.author}`)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /View/i })).toBeInTheDocument();
  });
});