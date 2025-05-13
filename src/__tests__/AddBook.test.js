import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AddBook from '../AddBook';

jest.mock('../BookService', () => ({
  createBook: jest.fn().mockResolvedValue({ data: { id: 'new-id' } }),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container" />,
}));

describe('AddBook Component', () => {
  test('renders Add New Book form', () => {
    render(
      <MemoryRouter>
        <AddBook />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /Add New Book/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Book/i })).toBeInTheDocument();
  });
});