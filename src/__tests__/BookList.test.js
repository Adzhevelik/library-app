// src/__tests__/BookList.test.js

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react'; // Добавил waitFor
import { MemoryRouter } from 'react-router-dom';
import BookList from '../BookList';
import BookService from '../BookService'; // Убедись, что этот импорт есть
import { toast } from 'react-toastify';   // И этот, если используешь toast в BookList

// Мок для BookService
jest.mock('../BookService', () => ({
    getAllBooks: jest.fn(), // Инициализируем как jest.fn()
    deleteBook: jest.fn(),  // Инициализируем как jest.fn()
    // Добавь остальные функции из BookService, если они вызываются в BookList
}));

// Мок для react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container"/>, // Для рендера ToastContainer в App
}));


describe('BookList Component', () => {
  beforeEach(() => {
    // Очищаем вызовы моков перед каждым тестом
    BookService.getAllBooks.mockClear();
    BookService.deleteBook.mockClear();
    toast.success.mockClear();
    toast.error.mockClear();

    // Дефолтный успешный ответ для getAllBooks
    // (можно переопределить в конкретных тестах)
    BookService.getAllBooks.mockResolvedValue({ data: [] });
  });

  test('renders loading state initially and then book library title if no books', async () => {
    // BookService.getAllBooks уже мокнут в beforeEach на возврат пустого массива
    render(
        <MemoryRouter>
            <BookList />
        </MemoryRouter>
    );

    // Сначала проверяем состояние загрузки (если оно есть и видимо)
    // Если загрузка очень быстрая, этот expect может не успеть.
    // Если твой компонент явно показывает "Loading books...", то это должно работать.
    // Если нет, можно убрать эту проверку.
    // expect(screen.getByText(/Loading books.../i)).toBeInTheDocument();

    // Ждем, пока компонент отрендерит контент после загрузки
    expect(await screen.findByRole('heading', { name: /Book Library/i })).toBeInTheDocument();
    expect(BookService.getAllBooks).toHaveBeenCalledTimes(1);
    // Если книг нет, должен быть соответствующий текст
    expect(screen.getByText(/No books found/i)).toBeInTheDocument();
    // Проверяем ссылку на добавление книги
    expect(screen.getByRole('link', { name: /Add a new book/i })).toBeInTheDocument();
  });

  test('displays books when data is fetched', async () => {
    const mockBooksData = [
      { id: '1', title: 'Test Book 1', author: 'Author 1', description: 'Desc 1', genre: 'Fiction', availableCopies: 1, totalCopies: 1 },
      { id: '2', title: 'Test Book 2', author: 'Author 2', description: 'Desc 2', genre: 'Sci-Fi', availableCopies: 0, totalCopies: 2 },
    ];
    BookService.getAllBooks.mockResolvedValueOnce({ data: mockBooksData });

    render(
        <MemoryRouter>
            <BookList />
        </MemoryRouter>
    );

    // Ждем появления заголовков книг
    expect(await screen.findByText(mockBooksData[0].title)).toBeInTheDocument();
    expect(screen.getByText(mockBooksData[1].title)).toBeInTheDocument();
    expect(screen.getByText(`by ${mockBooksData[0].author}`)).toBeInTheDocument();
    expect(screen.getByText(`by ${mockBooksData[1].author}`)).toBeInTheDocument();
    expect(screen.getByText(`Total Books: ${mockBooksData.length}`)).toBeInTheDocument();
  });

  test('displays error message if fetching books fails', async () => {
    BookService.getAllBooks.mockRejectedValueOnce(new Error('Network Error'));
    render(
        <MemoryRouter>
            <BookList />
        </MemoryRouter>
    );

    // Ждем сообщение об ошибке (текст зависит от твоего компонента)
    expect(await screen.findByText(/Failed to load books/i)).toBeInTheDocument();
    // И проверяем, что был вызван toast.error
    expect(toast.error).toHaveBeenCalledWith('Failed to load books');
  });

  // Здесь можно добавить тесты на удаление книги, если хочешь
});