import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import EditBook from '../EditBook';

describe('EditBook Component', () => {
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

  it('should render the form with book data', () => {
    render(
      <MemoryRouter initialEntries={[`/books/edit/${book.id}`]}>
        <Routes>
          <Route path="/books/edit/:id" element={<EditBook />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByDisplayValue('Test Book')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Author')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
  });

  it('should show error if title is empty', async () => {
    render(
      <MemoryRouter initialEntries={[`/books/edit/${book.id}`]}>
        <Routes>
          <Route path="/books/edit/:id" element={<EditBook />} />
        </Routes>
      </MemoryRouter>
    );

    const titleInput = screen.getByLabelText('Title *');
    fireEvent.change(titleInput, { target: { value: '' } });
    fireEvent.click(screen.getByText('Save Changes'));

    expect(await screen.findByText('Title is required')).toBeInTheDocument();
  });
});
