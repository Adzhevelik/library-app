// BookCard.test.js - ���������� ���� ��� BookCard
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BookCard from '../BookCard';

describe('BookCard Component', () => {
  const mockBook = {
    id: 1,
    title: '�������� �����',
    author: '�������� �����',
    description: '�������� �����',
    genre: '����������',
    availableCopies: 2,
    totalCopies: 5
  };
  
  const mockOnDelete = jest.fn();

  it('������ ���������� ���������� � �����', () => {
    render(
      <MemoryRouter>
        <BookCard book={mockBook} onDelete={mockOnDelete} />
      </MemoryRouter>
    );
    
    expect(screen.getByText('�������� �����')).toBeInTheDocument();
    expect(screen.getByText(/�������� �����/)).toBeInTheDocument();
  });
});