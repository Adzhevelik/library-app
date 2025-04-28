import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import BookList from '../BookList';
import BookService from '../BookService';
import { toast } from 'react-toastify';

// Мокаем зависимости
jest.mock('../BookService');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container"/>,
}));
// Модальное окно является частью BookList, поэтому его не мокаем отдельно

const mockBooks = [
  {
    id: '1',
    title: 'Book One List',
    author: 'Author One',
    description: 'Description for book one.',
    genre: 'Fiction',
    availableCopies: 2,
    totalCopies: 3,
  },
  {
    id: '2',
    title: 'Book Two List',
    author: 'Author Two',
    description: 'Description for book two, long.',
    genre: 'Non-Fiction',
    availableCopies: 1,
    totalCopies: 1,
  },
];

describe('BookList Component', () => {
    const user = userEvent.setup();

    beforeEach(() => {
        jest.clearAllMocks();
        BookService.getAllBooks.mockResolvedValue({ data: [...mockBooks] });
        BookService.deleteBook.mockResolvedValue({}); // Успех по умолчанию
    });

    const renderComponent = () =>
        render(
        <MemoryRouter>
            <BookList />
        </MemoryRouter>
        );

    // --- Тесты загрузки и отображения ---
    test('fetches and displays list of books', async () => {
        renderComponent();
        expect(screen.getByText(/Loading books.../i)).toBeInTheDocument();
        expect(await screen.findByRole('heading', { name: /Book Library/i })).toBeInTheDocument();
        expect(screen.getByText(`Total Books: ${mockBooks.length}`)).toBeInTheDocument();

        for (const book of mockBooks) {
            expect(screen.getByText(book.title)).toBeInTheDocument();
            expect(screen.getByText(`by ${book.author}`)).toBeInTheDocument();
            const card = screen.getByText(book.title).closest('.book-card');
            expect(card).not.toBeNull();
             // eslint-disable-next-line testing-library/no-node-access
             const descriptionElement = card.querySelector('p.book-description');
             expect(descriptionElement).toBeInTheDocument();
             if (book.description.length > 100) {
                expect(descriptionElement).toHaveTextContent(/...\s*$/);
             } else {
                expect(descriptionElement).toHaveTextContent(book.description);
             }
             // eslint-disable-next-line testing-library/no-node-access
             expect(card.querySelector('.book-details')).toHaveTextContent(`Genre: ${book.genre || 'Not specified'}`);
             // eslint-disable-next-line testing-library/no-node-access
             expect(card.querySelector('.book-details')).toHaveTextContent(`Available Copies: ${book.availableCopies || 0} / ${book.totalCopies || 0}`);
             // eslint-disable-next-line testing-library/no-node-access
            expect(card.querySelector(`a[href="/books/${book.id}"]`)).toBeInTheDocument();
            // eslint-disable-next-line testing-library/no-node-access
            expect(card.querySelector(`a[href="/books/edit/${book.id}"]`)).toBeInTheDocument();
            // eslint-disable-next-line testing-library/no-node-access
            expect(card.querySelector('button.btn-danger')).toBeInTheDocument();
        }
        expect(BookService.getAllBooks).toHaveBeenCalledTimes(1);
    });

    test('displays message when no books are found', async () => {
        BookService.getAllBooks.mockResolvedValue({ data: [] });
        renderComponent();
        expect(await screen.findByText(/No books found./i)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Add a new book/i })).toHaveAttribute('href', '/books/add');
    });

    test('displays error message if fetching fails', async () => {
        const error = new Error('Network Error');
        BookService.getAllBooks.mockRejectedValue(error);
        renderComponent();
        expect(await screen.findByText(/Failed to load books. Please try again later./i)).toBeInTheDocument();
        expect(toast.error).toHaveBeenCalledWith('Failed to load books');
    });

    // --- Тесты модального окна удаления ---
     const openDeleteModalForFirstBook = async () => {
         await screen.findByText(mockBooks[0].title); // Дождаться загрузки
         const card1 = screen.getByText(mockBooks[0].title).closest('.book-card');
         // eslint-disable-next-line testing-library/no-node-access
         const deleteButton1 = card1.querySelector('button.btn-danger');
         await user.click(deleteButton1);
         const modal = await screen.findByRole('dialog'); // Модалки часто имеют роль dialog
         expect(screen.getByRole('heading', { name: /Delete Book/i, container: modal })).toBeInTheDocument();
         return modal;
     };

    test('opens delete confirmation modal when delete button on a card is clicked', async () => {
        renderComponent();
        const modal = await openDeleteModalForFirstBook();
        expect(screen.getByText(mockBooks[0].title, { exact: false })).toBeInTheDocument(); // Проверка названия книги в модалке
        expect(screen.getByRole('button', { name: 'Cancel', container: modal })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Delete/i, container: modal })).toBeInTheDocument();
    });

     test('closes delete modal when Cancel button in modal is clicked', async () => {
        renderComponent();
        const modal = await openDeleteModalForFirstBook();
        const modalCancelButton = screen.getByRole('button', { name: /Cancel/i, container: modal });
        await user.click(modalCancelButton);
        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
    });

     test('closes delete modal when clicking backdrop', async () => {
        renderComponent();
        await openDeleteModalForFirstBook();
        // eslint-disable-next-line testing-library/no-node-access
        await user.click(screen.getByRole('dialog').parentElement); // Клик на backdrop
        await waitFor(() => {
          expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
      });


    test('removes book from list after successful deletion via modal', async () => {
        renderComponent();
        await screen.findByText(mockBooks[0].title);
        const modal = await openDeleteModalForFirstBook();
        const confirmButton = screen.getByRole('button', { name: /Delete/i, container: modal });
        await user.click(confirmButton);

        await waitFor(() => expect(BookService.deleteBook).toHaveBeenCalledWith(mockBooks[0].id));
        await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Book deleted successfully'));
        await waitFor(() => expect(screen.queryByText(mockBooks[0].title)).not.toBeInTheDocument());

        expect(screen.getByText(mockBooks[1].title)).toBeInTheDocument();
        expect(screen.getAllByRole('heading', { level: 3 }).length).toBe(mockBooks.length - 1);
        expect(screen.getByText(`Total Books: ${mockBooks.length - 1}`)).toBeInTheDocument();
        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    });

    test('shows error toast when deletion fails from modal', async () => {
        const deleteError = { response: { data: { message: 'Failed to delete from list' } } };
        BookService.deleteBook.mockRejectedValue(deleteError);
        renderComponent();
        const modal = await openDeleteModalForFirstBook();
        const confirmButton = screen.getByRole('button', { name: /Delete/i, container: modal });
        await user.click(confirmButton);

        await waitFor(() => expect(BookService.deleteBook).toHaveBeenCalledWith(mockBooks[0].id));
        await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Failed to delete from list'));

        expect(screen.getByText(mockBooks[0].title)).toBeInTheDocument(); // Книга не удалена
        expect(screen.getAllByRole('heading', { level: 3 }).length).toBe(mockBooks.length);
        expect(screen.getByRole('dialog')).toBeInTheDocument(); // Модалка остается
    });

    test('shows generic error toast if delete fails without message from modal', async () => {
        const genericError = new Error('Some network error');
        BookService.deleteBook.mockRejectedValue(genericError);
        renderComponent();
        const modal = await openDeleteModalForFirstBook();
        const confirmButton = screen.getByRole('button', { name: /Delete/i, container: modal });
        await user.click(confirmButton);

        await waitFor(() => expect(BookService.deleteBook).toHaveBeenCalledWith(mockBooks[0].id));
        await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Failed to delete book')); // Сообщение по умолчанию

        expect(screen.getByText(mockBooks[0].title)).toBeInTheDocument();
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
});