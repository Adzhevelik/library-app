import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import SearchBooks from '../SearchBooks';
import BookService from '../BookService';
import { toast } from 'react-toastify';

jest.mock('../BookService');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container"/>,
}));

const mockSearchResults = [
  { id: 's1', title: 'Search Result One', author: 'Author S1', genre: 'SearchGenre', isbn: '111' },
];

describe('SearchBooks Component', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    BookService.searchBooks.mockResolvedValue({ data: [] }); // Default to no results
    BookService.deleteBook.mockResolvedValue({ data: { message: 'Deleted' } });
  });

  test('renders search form', () => {
    render(
      <MemoryRouter>
        <SearchBooks />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /Search Books/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search by title, author, or ISBN.../i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search/i })).toBeInTheDocument();
  });

  test('performs a search and displays results', async () => {
    BookService.searchBooks.mockResolvedValue({ data: mockSearchResults });
    render(
      <MemoryRouter>
        <SearchBooks />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(/Search by title, author, or ISBN.../i);
    const searchButton = screen.getByRole('button', { name: /Search/i });

    await act(async () => {
      await user.type(searchInput, 'Result One');
      await user.click(searchButton);
    });
    
    expect(BookService.searchBooks).toHaveBeenCalledWith('Result One');
    expect(await screen.findByText(mockSearchResults[0].title)).toBeInTheDocument();
    expect(screen.getByText(`Search Results (${mockSearchResults.length})`)).toBeInTheDocument();
  });

  test('shows "no books found" message if search returns empty', async () => {
    BookService.searchBooks.mockResolvedValue({ data: [] });
     render(
      <MemoryRouter>
        <SearchBooks />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(/Search by title, author, or ISBN.../i);
    const searchButton = screen.getByRole('button', { name: /Search/i });

    await act(async () => {
      await user.type(searchInput, 'NonExistent');
      await user.click(searchButton);
    });

    expect(await screen.findByText(/No books found matching your search criteria./i)).toBeInTheDocument();
  });
});