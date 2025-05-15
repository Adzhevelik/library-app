import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route, useNavigate } from 'react-router-dom';
import BookDetails from '../BookDetails'; // ��������������, ��� DeleteBookModal ��������� � ���� �� ����� ��� ������������� � ����
import BookService from '../BookService';
import { toast } from 'react-toastify';

// ��� ��� useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }), // ������ useParams, ����� ������ ��� id '1' ��� ������
  useNavigate: () => mockNavigate,
}));

// ��� ��� BookService
jest.mock('../BookService');

// ��� ��� react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container" />,
}));

const mockBook = {
  id: '1',
  title: 'The Great Test Book',
  author: 'Test Author Supreme',
  description: 'A very detailed description of a great test book.',
  publicationDate: '2023-01-15',
  isbn: '978-3-16-148410-0',
  genre: 'Testing',
  availableCopies: 3,
  totalCopies: 5,
  createdAt: '2023-01-01T10:00:00.000Z',
  updatedAt: '2023-01-10T12:00:00.000Z',
};

describe('BookDetails Component', () => {
  const user = userEvent.setup({ delay: null }); // delay: null ��� ��������� userEvent � ������

  beforeEach(() => {
    jest.clearAllMocks();
    BookService.getBookById.mockResolvedValue({ data: { ...mockBook } });
    BookService.deleteBook.mockResolvedValue({ data: { message: 'Book deleted successfully' } });
  });

  const renderComponent = () => {
    render(
      <MemoryRouter initialEntries={['/books/1']}>
        <Routes>
          <Route path="/books/:id" element={<BookDetails />} />
        </Routes>
      </MemoryRouter>
    );
  }

  test('renders loading state then book details', async () => {
    renderComponent();
    expect(screen.getByText(/Loading book details.../i)).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: mockBook.title })).toBeInTheDocument();
    expect(screen.getByText(`Author: ${mockBook.author}`)).toBeInTheDocument(); // ������� �����
    expect(screen.getByText(mockBook.description)).toBeInTheDocument();
    expect(screen.getByText(`ISBN: ${mockBook.isbn}`)).toBeInTheDocument(); // ������� �����
    expect(BookService.getBookById).toHaveBeenCalledWith('1');
  });

  test('shows error message if fetching book details fails', async () => {
    BookService.getBookById.mockRejectedValueOnce(new Error('Failed to fetch details'));
    renderComponent();
    // ����� ������ ������� � ����������, ����� book null
    expect(await screen.findByText(/Failed to load book details. The book might not exist or has been removed./i)).toBeInTheDocument();
    expect(toast.error).toHaveBeenCalledWith('Failed to load book details');
  });

  test('opens delete confirmation modal and deletes book', async () => {
    renderComponent();
    await screen.findByRole('heading', { name: mockBook.title });

    // ������ �� �������� �������
    const pageDeleteButton = screen.getByRole('button', { name: /^Delete$/i }); // ����� ������ "Delete"
    await act(async () => {
        await user.click(pageDeleteButton);
    });

    // ��������� ���� ������ ���������, ��������� "Delete Book"
    expect(await screen.findByRole('heading', { name: /Delete Book/i, level: 3 })).toBeInTheDocument(); // ������� �������� �������
    expect(screen.getByText(`Are you sure you want to delete the book "${mockBook.title}"?`)).toBeInTheDocument();

    // ������ ������������� � �������, ���� "Delete"
    const modalConfirmDeleteButton = within(screen.getByRole('dialog')).getByRole('button', { name: /^Delete$/i });
    await act(async () => {
        await user.click(modalConfirmDeleteButton);
    });

    await waitFor(() => {
        expect(BookService.deleteBook).toHaveBeenCalledWith('1');
    });
    expect(toast.success).toHaveBeenCalledWith('Book deleted successfully');
    expect(mockNavigate).toHaveBeenCalledWith('/books');
  });

  test('closes delete modal on cancel', async () => {
    renderComponent();
    await screen.findByRole('heading', { name: mockBook.title });

    const pageDeleteButton = screen.getByRole('button', { name: /^Delete$/i });
     await act(async () => {
        await user.click(pageDeleteButton);
    });
    
    const modalTitle = await screen.findByRole('heading', { name: /Delete Book/i, level: 3 });
    expect(modalTitle).toBeInTheDocument();
    
    // ������ ������ � �������
    const modalCancelButton = within(screen.getByRole('dialog')).getByRole('button', { name: /Cancel/i });
     await act(async () => {
        await user.click(modalCancelButton);
    });

    await waitFor(() => {
        // ���������, ��� ��������� ���� (�� ��� ���������) �������
        expect(screen.queryByRole('heading', { name: /Delete Book/i, level: 3 })).not.toBeInTheDocument();
    });
  });

  // ������� helper 'within' �� testing-library, ���� ��� �� ������������
});
// � ������ ����� ����� ������:
// import { ..., within } from '@testing-library/react';
// ���� within ��� ����, �� ������ �� ��������.