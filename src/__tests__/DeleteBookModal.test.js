import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeleteBookModal from '../DeleteBookModal'; // Убедитесь, что путь правильный
import BookService from '../BookService'; // Убедитесь, что путь правильный

jest.mock('../BookService', () => ({
  deleteBook: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockBook = {
  id: '1',
  title: 'Book to Delete',
};

describe('DeleteBookModal Component', () => {
  test('renders nothing if not open', () => {
    const { container } = render(
      <DeleteBookModal
        book={mockBook}
        isOpen={false}
        onClose={jest.fn()}
        onSuccess={jest.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  test('renders modal when open with book title and buttons', () => {
    render(
      <DeleteBookModal
        book={mockBook}
        isOpen={true}
        onClose={jest.fn()}
        onSuccess={jest.fn()}
      />
    );
    expect(screen.getByRole('heading', { name: /Delete Book/i })).toBeInTheDocument();
    expect(screen.getByText(`Are you sure you want to delete the book "${mockBook.title}"?`)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Delete/i })).toBeInTheDocument();
  });

  test('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    const handleClose = jest.fn();
    render(
      <DeleteBookModal
        book={mockBook}
        isOpen={true}
        onClose={handleClose}
        onSuccess={jest.fn()}
      />
    );
    await user.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});