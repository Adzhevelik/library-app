import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import SearchBooks from '../SearchBooks';
import BookService from '../BookService';

// Мокаем зависимости
jest.mock('../BookService', () => ({
  searchBooks: jest.fn().mockResolvedValue({ 
    data: [
      { 
        id: '123', 
        title: 'Test Book 1', 
        author: 'Test Author 1',
        genre: 'Test Genre',
        isbn: '1234567890'
      },
      { 
        id: '456', 
        title: 'Test Book 2', 
        author: 'Test Author 2',
        genre: 'Test Genre 2',
        isbn: '0987654321'
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

describe('SearchBooks Component', () => {
  test('renders search form', () => {
    render(
      <MemoryRouter>
        <SearchBooks />
      </MemoryRouter>
    );
    // Базовый тест без проверок
  });
  
  test('performs search on form submit', async () => {
    render(
      <MemoryRouter>
        <SearchBooks />
      </MemoryRouter>
    );
    
    const searchInput = screen.getByPlaceholderText(/Search by title, author, or ISBN.../i);
    const searchButton = screen.getByRole('button', { name: /Search/i });
    
    fireEvent.change(searchInput, { target: { value: 'test query' } });
    fireEvent.click(searchButton);
    
    // Базовый тест без дополнительных проверок
  });
});