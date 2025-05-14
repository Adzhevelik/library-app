import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BookCard from '../BookCard';

describe('BookCard Component', () => {
  const mockBook = {
    id: 1,
    title: '“естова€ книга',
    author: '“естовый автор',
    description: 'Ёто очень длинное описание тестовой книги, которое должно быть сокращено в компоненте',
    genre: '‘антастика',
    availableCopies: 3,
    totalCopies: 5
  };

  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должен корректно отображать информацию о книге', () => {
    render(
      <MemoryRouter>
        <BookCard book={mockBook} onDelete={mockOnDelete} />
      </MemoryRouter>
    );

    expect(screen.getByText('“естова€ книга')).toBeInTheDocument();
    expect(screen.getByText('by “естовый автор')).toBeInTheDocument();
    expect(screen.getByText('‘антастика')).toBeInTheDocument();
    expect(screen.getByText('3/5 available')).toBeInTheDocument();
  });

  it('должен сокращать длинное описание', () => {
    render(
      <MemoryRouter>
        <BookCard book={mockBook} onDelete={mockOnDelete} />
      </MemoryRouter>
    );

    // ќписание должно быть сокращено до 100 символов и добавлено "..."
    expect(screen.getByText(/Ёто очень длинное описание/)).toBeInTheDocument();
    expect(screen.getByText(/\.\.\./)).toBeInTheDocument();
  });

  it('должен отображать "No description available" если описание отсутствует', () => {
    const bookWithoutDescription = { ...mockBook, description: undefined };
    
    render(
      <MemoryRouter>
        <BookCard book={bookWithoutDescription} onDelete={mockOnDelete} />
      </MemoryRouter>
    );

    expect(screen.getByText('No description available')).toBeInTheDocument();
  });

  it('должен отображать "Not specified" если жанр отсутствует', () => {
    const bookWithoutGenre = { ...mockBook, genre: undefined };
    
    render(
      <MemoryRouter>
        <BookCard book={bookWithoutGenre} onDelete={mockOnDelete} />
      </MemoryRouter>
    );

    expect(screen.getByText('Not specified')).toBeInTheDocument();
  });

  it('должен отображать ссылки на просмотр и редактирование книги', () => {
    render(
      <MemoryRouter>
        <BookCard book={mockBook} onDelete={mockOnDelete} />
      </MemoryRouter>
    );

    expect(screen.getByText('View').closest('a')).toHaveAttribute('href', '/books/1');
    expect(screen.getByText('Edit').closest('a')).toHaveAttribute('href', '/books/edit/1');
  });

  it('должен вызывать функцию onDelete при нажатии на кнопку удалени€', () => {
    render(
      <MemoryRouter>
        <BookCard book={mockBook} onDelete={mockOnDelete} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Delete'));
    
    expect(mockOnDelete).toHaveB