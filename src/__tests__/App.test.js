import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

// Mock child components that might have their own complex logic or API calls
jest.mock('../BookList', () => () => <div data-testid="book-list-mock">BookList Mock</div>);
jest.mock('../Header', () => () => <div data-testid="header-mock">Header Mock</div>);
jest.mock('../Footer', () => () => <div data-testid="footer-mock">Footer Mock</div>);

describe('App Component', () => {
  test('renders main application layout', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    // Check if mocked components are rendered
    expect(screen.getByTestId('header-mock')).toBeInTheDocument();
    expect(screen.getByTestId('book-list-mock')).toBeInTheDocument(); // Assuming '/' route renders BookList
    expect(screen.getByTestId('footer-mock')).toBeInTheDocument();
    expect(screen.getByTestId('toast-container')).toBeInTheDocument(); // From react-toastify mock in BookList.test.js (global mock)
  });
});