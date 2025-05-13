import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import EditBook from '../EditBook'; // Убедитесь, что путь правильный
import BookService from '../BookService'; // Убедитесь, что путь правильный

jest.mock('../BookService');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container"/>,
}));

const mockBookToEdit = {
  id: '1',
  title: 'Existing Book',
  author: 'Existing Author',
  description: 'Description here',
  publicationDate: '2022-01-01',
  isbn: '1234567890123',
  genre: 'Fiction',
  availableCopies: 2,
  totalCopies: 3,
};

describe('EditBook Component', () => {
  beforeEach(() => {
    BookService.getBookById.mockResolvedValue({ data: mockBookToEdit });
    BookService.updateBook.mockResolvedValue({ data: { ...mockBookToEdit, title: 'Updated Title' } });
  });

  test('renders Edit Book form with pre-filled data', async () => {
    render(
      <MemoryRouter initialEntries={['/books/edit/1']}>
        <Routes>
          <Route path="/books/edit/:id" element={<EditBook />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading book data.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Edit Book/i })).toBeInTheDocument();
    });
    
    // Check if a key field is populated
    expect(screen.getByLabelText(/Title/i)).toHaveValue(mockBookToEdit.title);
    expect(screen.getByRole('button', { name: /Update Book/i })).toBeInTheDocument();
    expect(BookService.getBookById).toHaveBeenCalledWith('1');
  });
});