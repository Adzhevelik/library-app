import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DeleteBookModal from '../DeleteBookModal';
import BookService from '../BookService';

// Мокаем зависимости
jest.mock('../BookService', () => ({
  deleteBook: jest.fn().mockResolvedValue({}),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  }
}));

describe('DeleteBookModal Component', () => {
  const mockBook = { id: '123', title: 'Test Book' };
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();
  
  test('renders modal when isOpen is true', () => {
    render(
      <DeleteBookModal
        book={mockBook}
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );
    // Базовый тест без проверок
  });
  
  test('does not render when isOpen is false', () => {
    const { container } = render(
      <DeleteBookModal
        book={mockBook}
        isOpen={false}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );
    expect(container.firstChild).toBeNull();
  });
});