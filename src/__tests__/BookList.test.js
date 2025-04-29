import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BookList from '../BookList';

// Мокаем зависимости
jest.mock('../BookService', () => ({
  getAllBooks: jest.fn().mockResolvedValue({ 
    data: [
      { 
        id: '123', 
        title: 'Test Book 1', 
        author: 'Test Author 1',
        description: 'Test description 1',
        genre: 'Test Genre',
        availableCopies: 5,
        totalCopies: 10
      },
      { 
        id: '456', 
        title: 'Test Book 2', 
        author: 'Test Author 2',
        description: 'Test description 2',
        genre: 'Test Genre 2',
        availableCopies: 3,
        totalCopies: 7
      }
    ] 
  }),
  deleteBook: jest.fn().mockResolvedValue({}),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  }
}));

describe('BookList Component', () => {
  test('renders without crashing', () => {
    render(
      <MemoryRouter>
        <BookList />
      </MemoryRouter>
    );
    // Базовый тест без проверок
  });
});