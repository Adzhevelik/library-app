// BookCard.test.js - простейший тест для BookCard
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BookCard from '../BookCard';

describe('BookCard Component', () => {
  const mockBook = {
    id: 1,
    title: 'Тестовая книга',
    author: 'Тестовый автор',
    description: 'Описание книги',
    genre: 'Фантастика',
    availableCopies: 2,
    totalCopies: 5
  };
  
  const mockOnDelete = jest.fn();

  it('должен отображать информацию о книге', () => {
    render(
      <MemoryRouter>
        <BookCard book={mockBook} onDelete={mockOnDelete} />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Тестовая книга')).toBeInTheDocument();
    expect(screen.getByText(/Тестовый автор/)).toBeInTheDocument();
  });
});