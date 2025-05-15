import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BookCard from '../BookCard';

describe('BookCard Component', () => {
  const mockBook = {
    id: 1,
    title: '�������� �����',
    author: '�������� �����',
    description: '��� ����� ������� �������� �������� �����, ������� ������ ���� ��������� � ����������',
    genre: '����������',
    availableCopies: 3,
    totalCopies: 5
  };

  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('������ ��������� ���������� ���������� � �����', () => {
    render(
      <MemoryRouter>
        <BookCard book={mockBook} onDelete={mockOnDelete} />
      </MemoryRouter>
    );

    expect(screen.getByText('�������� �����')).toBeInTheDocument();
    expect(screen.getByText('by �������� �����')).toBeInTheDocument();
    expect(screen.getByText('����������')).toBeInTheDocument();
    expect(screen.getByText('3/5 available')).toBeInTheDocument();
  });

  it('������ ��������� ������� ��������', () => {
    render(
      <MemoryRouter>
        <BookCard book={mockBook} onDelete={mockOnDelete} />
      </MemoryRouter>
    );

    // �������� ������ ���� ��������� �� 100 �������� � ��������� "..."
    expect(screen.getByText(/��� ����� ������� ��������/)).toBeInTheDocument();
    expect(screen.getByText(/\.\.\./)).toBeInTheDocument();
  });

  it('������ ���������� "No description available" ���� �������� �����������', () => {
    const bookWithoutDescription = { ...mockBook, description: undefined };
    
    render(
      <MemoryRouter>
        <BookCard book={bookWithoutDescription} onDelete={mockOnDelete} />
      </MemoryRouter>
    );

    expect(screen.getByText('No description available')).toBeInTheDocument();
  });

  it('������ ���������� "Not specified" ���� ���� �����������', () => {
    const bookWithoutGenre = { ...mockBook, genre: undefined };
    
    render(
      <MemoryRouter>
        <BookCard book={bookWithoutGenre} onDelete={mockOnDelete} />
      </MemoryRouter>
    );

    expect(screen.getByText('Not specified')).toBeInTheDocument();
  });

  it('������ ���������� ������ �� �������� � �������������� �����', () => {
    render(
      <MemoryRouter>
        <BookCard book={mockBook} onDelete={mockOnDelete} />
      </MemoryRouter>
    );

    expect(screen.getByText('View').closest('a')).toHaveAttribute('href', '/books/1');
    expect(screen.getByText('Edit').closest('a')).toHaveAttribute('href', '/books/edit/1');
  });

  it('������ �������� ������� onDelete ��� ������� �� ������ ��������', () => {
    render(
      <MemoryRouter>
        <BookCard book={mockBook} onDelete={mockOnDelete} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Delete'));
    
    expect(mockOnDelete).toHaveB