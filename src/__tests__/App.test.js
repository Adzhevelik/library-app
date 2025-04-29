import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

// Мокаем все компоненты, которые использует App
jest.mock('../Header', () => () => <header data-testid="header">Header</header>);
jest.mock('../Footer', () => () => <footer data-testid="footer">Footer</footer>);
jest.mock('../BookList', () => () => <div data-testid="book-list">BookList</div>);
jest.mock('../AddBook', () => () => <div data-testid="add-book">AddBook</div>);
jest.mock('../EditBook', () => () => <div data-testid="edit-book">EditBook</div>);
jest.mock('../BookDetails', () => () => <div data-testid="book-details">BookDetails</div>);
jest.mock('../SearchBooks', () => () => <div data-testid="search-books">SearchBooks</div>);
jest.mock('../NotFound', () => () => <div data-testid="not-found">NotFound</div>);
jest.mock('react-toastify', () => ({
  ToastContainer: () => <div data-testid="toast-container">ToastContainer</div>,
}));

describe('App Component', () => {
  test('renders without crashing', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    // Базовый тест без проверок
  });
});