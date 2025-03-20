import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // ????????? MemoryRouter
import BookCard from '../BookCard';

describe('BookCard Component', () => {
  const book = {
    id: 1,
    title: 'Test Book',
    author: 'Test Author',
    description: 'Test Description',
    genre: 'Test Genre',
    availableCopies: 5,
    totalCopies: 10
  };

  it('should render book title', () => {
    render(
      <MemoryRouter>
        <BookCard book={book} onDelete={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByText('Test Book')).toBeInTheDocument();
  });

  it('should render book author', () => {
    render(
      <MemoryRouter>
        <BookCard book={book} onDelete={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByText('by Test Author')).toBeInTheDocument();
  });

  it('should render available copies', () => {
    render(
      <MemoryRouter>
        <BookCard book={book} onDelete={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByText('5/10 available')).toBeInTheDocument();
  });
});