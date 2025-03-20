import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import BookDetails from '../BookDetails';

describe('BookDetails Component', () => {
  const book = {
    id: 1,
    title: 'Test Book',
    author: 'Test Author',
    description: 'Test Description',
    publicationDate: '2023-01-01',
    isbn: '1234567890',
    genre: 'Test Genre',
    availableCopies: 5,
    totalCopies: 10
  };

  it('should render book details', () => {
    render(
      <MemoryRouter initialEntries={[`/books/${book.id}`]}>
        <Routes>
          <Route path="/books/:id" element={<BookDetails />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Test Book')).toBeInTheDocument();
    expect(screen.getByText('by Test Author')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });
});
