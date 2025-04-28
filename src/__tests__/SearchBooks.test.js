import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import SearchBooks from '../SearchBooks';
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
// Мокаем модалку удаления
jest.mock('../DeleteBookModal', () => ({ book, isOpen, onClose, onSuccess }) => {
  if (!isOpen) return null;
  return (
    // Используем dialog роль для модалки
    <div role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <h3 id="modal-title">Delete Mock Modal for {book?.title}</h3>
      <button onClick={onClose}>Cancel</button>
      {/* Имитируем успешное удаление при клике */}
      <button onClick={onSuccess}>Delete</button>
    </div>
  );
});

const mockSearchResults = [
  { id: 's1', title: 'Search Result One', author: 'Search Author 1', genre: 'Search Genre 1', isbn: '1111111111' },
  { id: 's2', title: 'Result Two', author: 'Search Author 2', genre: 'Search Genre 2', isbn: '2222222222' },
];

describe('SearchBooks Component', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    BookService.searchBooks.mockResolvedValue({ data: [...mockSearchResults] });
    BookService.deleteBook.mockResolvedValue({}); // Мок для успешного удаления из модалки
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <SearchBooks />
      </MemoryRouter>
    );

  // --- Тесты рендеринга и поиска ---
  test('renders search form', () => {
    renderComponent();
    expect(screen.getByRole('heading', { name: /Search Books/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search by title, author, or ISBN/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search/i })).toBeInTheDocument();
    // Результаты не должны быть видны изначально
    expect(screen.queryByRole('heading', { name: /Search Results/i })).not.toBeInTheDocument();
  });

  test('shows error toast if search term is empty', async () => {
    renderComponent();
    const searchButton = screen.getByRole('button', { name: /Search/i });
    await user.click(searchButton);
    expect(toast.error).toHaveBeenCalledWith('Please enter a search term');
    expect(BookService.searchBooks).not.toHaveBeenCalled();
  });

  test('calls search service and displays results on submit', async () => {
    renderComponent();
    const searchInput = screen.getByPlaceholderText(/Search by title, author, or ISBN/i);
    const searchButton = screen.getByRole('button', { name: /Search/i });
    const searchTerm = 'Result';

    await user.type(searchInput, searchTerm);
    await user.click(searchButton);

    expect(screen.getByText(/Searching books.../i)).toBeInTheDocument(); // Лоадер

    await waitFor(() => expect(BookService.searchBooks).toHaveBeenCalledWith(searchTerm));

    // Результаты появились
    expect(await screen.findByRole('heading', { name: /Search Results \(2\)/i })).toBeInTheDocument();
    expect(screen.getByText(mockSearchResults[0].title)).toBeInTheDocument();
    expect(screen.getByText(`by ${mockSearchResults[0].author}`)).toBeInTheDocument();
    expect(screen.getByText(mockSearchResults[1].title)).toBeInTheDocument();
    expect(screen.getByText(`by ${mockSearchResults[1].author}`)).toBeInTheDocument();

    // Проверяем детали и кнопки в первой карточке результата
    const card1 = screen.getByText(mockSearchResults[0].title).closest('.book-card');
    expect(card1).not.toBeNull();
    // eslint-disable-next-line testing-library/no-node-access
    expect(card1.querySelector('.book-details')).toHaveTextContent(`Genre: ${mockSearchResults[0].genre}`);
     // eslint-disable-next-line testing-library/no-node-access
    expect(card1.querySelector('.book-details')).toHaveTextContent(`ISBN: ${mockSearchResults[0].isbn}`);
     // eslint-disable-next-line testing-library/no-node-access
    expect(card1.querySelector(`a[href="/books/${mockSearchResults[0].id}"]`)).toBeInTheDocument(); // View
     // eslint-disable-next-line testing-library/no-node-access
    expect(card1.querySelector(`a[href="/books/edit/${mockSearchResults[0].id}"]`)).toBeInTheDocument(); // Edit
     // eslint-disable-next-line testing-library/no-node-access
    expect(card1.querySelector('button.btn-danger')).toBeInTheDocument(); // Delete
  });

  test('displays message when no results are found', async () => {
    BookService.searchBooks.mockResolvedValue({ data: [] });
    renderComponent();
    const searchInput = screen.getByPlaceholderText(/Search by title, author, or ISBN/i);
    const searchButton = screen.getByRole('button', { name: /Search/i });
    const searchTerm = 'nonexistent';

    await user.type(searchInput, searchTerm);
    await user.click(searchButton);

    expect(screen.getByText(/Searching books.../i)).toBeInTheDocument();
    await waitFor(() => expect(BookService.searchBooks).toHaveBeenCalledWith(searchTerm));
    expect(await screen.findByRole('heading', { name: /Search Results \(0\)/i })).toBeInTheDocument();
    expect(screen.getByText(/No books found matching your search criteria./i)).toBeInTheDocument();
  });

  test('displays error toast if search fails', async () => {
    const error = new Error('Search API failed');
    BookService.searchBooks.mockRejectedValue(error);
    renderComponent();
    const searchInput = screen.getByPlaceholderText(/Search by title, author, or ISBN/i);
    const searchButton = screen.getByRole('button', { name: /Search/i });
    const searchTerm = 'query';

    await user.type(searchInput, searchTerm);
    await user.click(searchButton);

    expect(screen.getByText(/Searching books.../i)).toBeInTheDocument();
    await waitFor(() => expect(BookService.searchBooks).toHaveBeenCalledWith(searchTerm));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Error searching books'));
    // Результаты не должны отображаться
    expect(screen.queryByRole('heading', { name: /Search Results/i })).not.toBeInTheDocument();
  });

  // --- Тесты удаления из результатов поиска ---
   const performSearchAndGetResults = async () => {
       const searchInput = screen.getByPlaceholderText(/Search by title, author, or ISBN/i);
       const searchButton = screen.getByRole('button', { name: /Search/i });
       await user.type(searchInput, 'Result');
       await user.click(searchButton);
       await screen.findByText(mockSearchResults[0].title); // Дождаться результатов
   };

    test('opens delete modal when delete button on a search result is clicked', async () => {
        renderComponent();
        await performSearchAndGetResults();

        // Находим кнопку Delete для первого результата
        const card1 = screen.getByText(mockSearchResults[0].title).closest('.book-card');
        // eslint-disable-next-line testing-library/no-node-access
        const deleteButton1 = card1.querySelector('button.btn-danger');
        await user.click(deleteButton1);

        // Модалка (мок) открывается
        expect(await screen.findByRole('dialog')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: `Delete Mock Modal for ${mockSearchResults[0].title}` })).toBeInTheDocument();
    });

    test('removes item from results list after successful deletion via modal', async () => {
        renderComponent();
        await performSearchAndGetResults();
        expect(screen.getAllByRole('heading', { level: 3 }).length).toBe(mockSearchResults.length);

         // Находим кнопку Delete для первого результата и кликаем
        const card1 = screen.getByText(mockSearchResults[0].title).closest('.book-card');
         // eslint-disable-next-line testing-library/no-node-access
        const deleteButton1 = card1.querySelector('button.btn-danger');
        await user.click(deleteButton1);

        // Ждем модалку и подтверждаем удаление (в моке)
        const modal = await screen.findByRole('dialog');
        // В моке кнопка подтверждения называется 'Delete'
        const confirmButton = screen.getByRole('button', { name: /Delete/i, container: modal });
        await user.click(confirmButton);

        // Ждем, пока элемент исчезнет из результатов
        await waitFor(() => {
            expect(screen.queryByText(mockSearchResults[0].title)).not.toBeInTheDocument();
        });

        // Второй результат остался
        expect(screen.getByText(mockSearchResults[1].title)).toBeInTheDocument();
        expect(screen.getAllByRole('heading', { level: 3 }).length).toBe(mockSearchResults.length - 1);
        expect(screen.getByRole('heading', { name: /Search Results \(1\)/i })).toBeInTheDocument(); // Заголовок обновился

         // Модалка должна закрыться
         await waitFor(() => {
             expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
         });
         // Проверяем тост успеха (вызывается в моке модалки)
         expect(toast.success).toHaveBeenCalledWith('Book deleted successfully');
    });

    test('closes delete modal when Cancel is clicked in modal', async () => {
         renderComponent();
         await performSearchAndGetResults();
         const card1 = screen.getByText(mockSearchResults[0].title).closest('.book-card');
         // eslint-disable-next-line testing-library/no-node-access
         const deleteButton1 = card1.querySelector('button.btn-danger');
         await user.click(deleteButton1);

         const modal = await screen.findByRole('dialog');
         const cancelButton = screen.getByRole('button', { name: /Cancel/i, container: modal });
         await user.click(cancelButton);

         await waitFor(() => {
             expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
         });
         // Список результатов не должен измениться
         expect(screen.getByText(mockSearchResults[0].title)).toBeInTheDocument();
         expect(screen.getAllByRole('heading', { level: 3 }).length).toBe(mockSearchResults.length);
    });

});