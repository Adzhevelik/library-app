import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import EditBook from '../EditBook';
import BookService from '../BookService';
import { toast } from 'react-toastify';

// Мокаем зависимости
jest.mock('../BookService');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container" />,
}));

const mockNavigate = jest.fn();
const mockBookId = '5';
// Мокаем хуки react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: mockBookId }), // Мокаем ID из URL
  useNavigate: () => mockNavigate,
}));

const mockExistingBook = {
  id: mockBookId,
  title: 'Old Title',
  author: 'Old Author',
  description: 'Old Description',
  publicationDate: '2020-02-02T00:00:00.000Z', // ISO формат
  isbn: '1112223333', // Валидный ISBN-10
  genre: 'Old Genre',
  availableCopies: 1,
  totalCopies: 2,
};

const formattedMockDate = '2020-02-02'; // YYYY-MM-DD

describe('EditBook Component', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    BookService.getBookById.mockResolvedValue({ data: { ...mockExistingBook } });
    BookService.updateBook.mockResolvedValue({ data: { ...mockExistingBook, title: 'Updated Title' } });
  });

  const renderComponent = () =>
    render(
      <MemoryRouter initialEntries={[`/books/edit/${mockBookId}`]}>
        <Routes>
          <Route path="/books/edit/:id" element={<EditBook />} />
          <Route path="/books/:id" element={<div>Book Details Page</div>} />
        </Routes>
      </MemoryRouter>
    );

  test('fetches book data and populates form on mount', async () => {
    renderComponent();
    expect(screen.getByText(/Loading book data.../i)).toBeInTheDocument();
    expect(await screen.findByLabelText(/Title/i)).toHaveValue(mockExistingBook.title);
    expect(screen.getByLabelText(/Author/i)).toHaveValue(mockExistingBook.author);
    expect(screen.getByLabelText(/Description/i)).toHaveValue(mockExistingBook.description);
    expect(screen.getByLabelText(/Publication Date/i)).toHaveValue(formattedMockDate);
    expect(screen.getByLabelText(/ISBN/i)).toHaveValue(mockExistingBook.isbn);
    expect(screen.getByLabelText(/Genre/i)).toHaveValue(mockExistingBook.genre);
    expect(screen.getByLabelText(/Available Copies/i)).toHaveValue(mockExistingBook.availableCopies);
    expect(screen.getByLabelText(/Total Copies/i)).toHaveValue(mockExistingBook.totalCopies);
    expect(screen.getByRole('button', { name: /Save Changes/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    expect(BookService.getBookById).toHaveBeenCalledWith(mockBookId);
  });

  test('displays error component if fetching book data fails', async () => {
    const error = new Error('Fetch failed');
    BookService.getBookById.mockRejectedValue(error);
    renderComponent();
    expect(await screen.findByText(/Failed to load book data./i)).toBeInTheDocument();
    expect(toast.error).toHaveBeenCalledWith('Failed to load book data');
    expect(screen.queryByLabelText(/Title/i)).not.toBeInTheDocument();
  });

  test('allows form fields to be updated', async () => {
    renderComponent();
    await screen.findByLabelText(/Title/i);
    const titleInput = screen.getByLabelText(/Title/i);
    const newTitle = 'Updated Book Title';
    await user.clear(titleInput);
    await user.type(titleInput, newTitle);
    expect(titleInput).toHaveValue(newTitle);
  });

  // --- Тесты валидации и отправки ---

  test('calls updateBook service and navigates on successful submit', async () => {
    renderComponent();
    await screen.findByLabelText(/Title/i);
    const titleInput = screen.getByLabelText(/Title/i);
    const newTitle = 'Updated Book Title';
    await user.clear(titleInput);
    await user.type(titleInput, newTitle);
    const submitButton = screen.getByRole('button', { name: /Save Changes/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(BookService.updateBook).toHaveBeenCalledTimes(1);
      expect(BookService.updateBook).toHaveBeenCalledWith(mockBookId, expect.objectContaining({
        title: newTitle,
        availableCopies: mockExistingBook.availableCopies, // Число
        totalCopies: mockExistingBook.totalCopies,       // Число
      }));
    });
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Book updated successfully!'));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith(`/books/${mockBookId}`));
  });

  test('shows error toast if title is empty on submit', async () => {
    renderComponent();
    await screen.findByLabelText(/Title/i);
    await user.clear(screen.getByLabelText(/Title/i));
    await user.click(screen.getByRole('button', { name: /Save Changes/i }));
    expect(toast.error).toHaveBeenCalledWith('Title is required');
    expect(BookService.updateBook).not.toHaveBeenCalled();
  });

  test('shows error toast if author is empty on submit', async () => {
    renderComponent();
    await screen.findByLabelText(/Author/i);
    await user.clear(screen.getByLabelText(/Author/i));
    await user.click(screen.getByRole('button', { name: /Save Changes/i }));
    expect(toast.error).toHaveBeenCalledWith('Author is required');
    expect(BookService.updateBook).not.toHaveBeenCalled();
  });

  test('shows error toast if ISBN is invalid', async () => {
    renderComponent();
    await screen.findByLabelText(/ISBN/i);
    const isbnInput = screen.getByLabelText(/ISBN/i);
    await user.clear(isbnInput);
    await user.type(isbnInput, '123'); // Invalid
    await user.click(screen.getByRole('button', { name: /Save Changes/i }));
    expect(toast.error).toHaveBeenCalledWith('ISBN must be 10 or 13 characters long');
    expect(BookService.updateBook).not.toHaveBeenCalled();
  });

  test('shows error toast if available copies exceed total copies', async () => {
    renderComponent();
    await screen.findByLabelText(/Available Copies/i);
    const availableCopiesInput = screen.getByLabelText(/Available Copies/i);
    const totalCopiesInput = screen.getByLabelText(/Total Copies/i);
    await user.clear(availableCopiesInput);
    await user.type(availableCopiesInput, '10');
    await user.clear(totalCopiesInput);
    await user.type(totalCopiesInput, '5'); // Invalid: 10 > 5
    await user.click(screen.getByRole('button', { name: /Save Changes/i }));
    expect(toast.error).toHaveBeenCalledWith('Available copies cannot exceed total copies');
    expect(BookService.updateBook).not.toHaveBeenCalled();
  });

  // --- Тесты обработки ошибок API ---

  test('shows specific API error toast if updateBook fails with response data', async () => {
    const apiError = { response: { data: { message: 'Update Failed From API' } } };
    BookService.updateBook.mockRejectedValue(apiError);
    renderComponent();
    await screen.findByLabelText(/Title/i);
    await user.type(screen.getByLabelText(/Title/i), ' - change'); // Make a change
    await user.click(screen.getByRole('button', { name: /Save Changes/i }));

    await waitFor(() => expect(BookService.updateBook).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Update Failed From API'));
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
  });

   test('shows generic error toast if updateBook fails without specific message', async () => {
    const genericError = new Error('Network Error');
    BookService.updateBook.mockRejectedValue(genericError);
    renderComponent();
    await screen.findByLabelText(/Title/i);
    await user.type(screen.getByLabelText(/Title/i), ' - change'); // Make a change
    await user.click(screen.getByRole('button', { name: /Save Changes/i }));

    await waitFor(() => expect(BookService.updateBook).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Failed to update book')); // Default message
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
  });

  // --- Тест кнопки Cancel ---

  test('navigates back to book details on Cancel click', async () => {
    renderComponent();
    await screen.findByLabelText(/Title/i);
    await user.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(mockNavigate).toHaveBeenCalledWith(`/books/${mockBookId}`);
    expect(BookService.updateBook).not.toHaveBeenCalled();
  });
});