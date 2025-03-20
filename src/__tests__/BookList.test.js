import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BookList from '../BookList';

describe('BookList Component', () => {
  const books = [
    {
      id: 1,
      title: 'Test Book 1',
      author: 'Test Author 1',
      description: 'Test Description 1',
      genre: 'Test Genre 1',
      availableCopies: 5,
      totalCopies: 10
    },
    {
      id: 2,
      title: 'Test Book 2',
      author: 'Test Author 2',
      description: 'Test Description 2',
      genre: 'Test Genre 2',
      availableCopies: 3,
      totalCopies: 5
    }
  ];

  it('should render a list of books', () => {
    render(
      <MemoryRouter>
        <BookList />
      </MemoryRouter>
    );

    expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    expect(screen.getByText('Test Book 2')).toBeInTheDocument();
  });

  it('should show "No books found" if the list is empty', () => {
    render(
      <MemoryRouter>
        <BookList />
      </MemoryRouter>
    );

    expect(screen.getByText('No books found.')).toBeInTheDocument();
  });
});
