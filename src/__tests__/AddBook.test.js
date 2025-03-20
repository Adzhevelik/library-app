import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AddBook from '../AddBook';

describe('AddBook Component', () => {
  it('should render the form', () => {
    render(
      <MemoryRouter>
        <AddBook />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('Title *')).toBeInTheDocument();
    expect(screen.getByLabelText('Author *')).toBeInTheDocument();
    expect(screen.getByText('Add Book')).toBeInTheDocument();
  });

  it('should show error if title is empty', async () => {
    render(
      <MemoryRouter>
        <AddBook />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Add Book'));
    expect(await screen.findByText('Title is required')).toBeInTheDocument();
  });

  it('should show error if author is empty', async () => {
    render(
      <MemoryRouter>
        <AddBook />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Add Book'));
    expect(await screen.findByText('Author is required')).toBeInTheDocument();
  });

  it('should show error if availableCopies > totalCopies', async () => {
    render(
      <MemoryRouter>
        <AddBook />
      </MemoryRouter>
    );

    const availableCopiesInput = screen.getByLabelText('Available Copies');
    const totalCopiesInput = screen.getByLabelText('Total Copies');

    fireEvent.change(availableCopiesInput, { target: { value: '10' } });
    fireEvent.change(totalCopiesInput, { target: { value: '5' } });
    fireEvent.click(screen.getByText('Add Book'));

    expect(
      await screen.findByText('Available copies cannot exceed total copies')
    ).toBeInTheDocument();
  });
});
