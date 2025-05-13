import React from 'react';
import { render, screen } from '@testing-library/react';
import BookForm from '../BookForm';

const mockBook = {
  title: '',
  author: '',
  description: '',
  publicationDate: '',
  isbn: '',
  genre: '',
  availableCopies: 1,
  totalCopies: 1,
};

describe('BookForm Component', () => {
  test('renders all form fields and action button', () => {
    render(
      <BookForm
        book={mockBook}
        onChange={jest.fn()}
        onSubmit={jest.fn()}
        loading={false}
        actionText="Submit Test"
        cancelAction={jest.fn()}
      />
    );
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Author/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit Test/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
  });
});