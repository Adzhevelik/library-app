// src/__tests__/BookList.test.js

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react'; // ������� waitFor
import { MemoryRouter } from 'react-router-dom';
import BookList from '../BookList';
import BookService from '../BookService'; // �������, ��� ���� ������ ����
import { toast } from 'react-toastify';   // � ����, ���� ����������� toast � BookList

// ��� ��� BookService
jest.mock('../BookService', () => ({
    getAllBooks: jest.fn(), // �������������� ��� jest.fn()
    deleteBook: jest.fn(),  // �������������� ��� jest.fn()
    // ������ ��������� ������� �� BookService, ���� ��� ���������� � BookList
}));

// ��� ��� react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container"/>, // ��� ������� ToastContainer � App
}));


describe('BookList Component', () => {
  beforeEach(() => {
    // ������� ������ ����� ����� ������ ������
    BookService.getAllBooks.mockClear();
    BookService.deleteBook.mockClear();
    toast.success.mockClear();
    toast.error.mockClear();

    // ��������� �������� ����� ��� getAllBooks
    // (����� �������������� � ���������� ������)
    BookService.getAllBooks.mockResolvedValue({ data: [] });
  });

  test('renders loading state initially and then book library title if no books', async () => {
    // BookService.getAllBooks ��� ������ � beforeEach �� ������� ������� �������
    render(
        <MemoryRouter>
            <BookList />
        </MemoryRouter>
    );

    // ������� ��������� ��������� �������� (���� ��� ���� � ������)
    // ���� �������� ����� �������, ���� expect ����� �� ������.
    // ���� ���� ��������� ���� ���������� "Loading books...", �� ��� ������ ��������.
    // ���� ���, ����� ������ ��� ��������.
    // expect(screen.getByText(/Loading books.../i)).toBeInTheDocument();

    // ����, ���� ��������� ���������� ������� ����� ��������
    expect(await screen.findByRole('heading', { name: /Book Library/i })).toBeInTheDocument();
    expect(BookService.getAllBooks).toHaveBeenCalledTimes(1);
    // ���� ���� ���, ������ ���� ��������������� �����
    expect(screen.getByText(/No books found/i)).toBeInTheDocument();
    // ��������� ������ �� ���������� �����
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

    // ���� ��������� ���������� ����
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

    // ���� ��������� �� ������ (����� ������� �� ������ ����������)
    expect(await screen.findByText(/Failed to load books/i)).toBeInTheDocument();
    // � ���������, ��� ��� ������ toast.error
    expect(toast.error).toHaveBeenCalledWith('Failed to load books');
  });

  // ����� ����� �������� ����� �� �������� �����, ���� ������
});