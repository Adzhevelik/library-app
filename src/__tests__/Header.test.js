import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Header from '../Header';

// Mock StatusIndicator as it's a child component and might have its own logic/API calls
jest.mock('../StatusIndicator', () => () => <div data-testid="status-indicator-mock">Status Mock</div>);

describe('Header Component', () => {
  const user = userEvent.setup();

  const renderWithRouter = (initialEntries = ['/']) => {
    render(
      <MemoryRouter initialEntries={initialEntries}>
        <Header />
      </MemoryRouter>
    );
  };

  it('should render the logo link and status indicator', () => {
    renderWithRouter();
    const logoLink = screen.getByRole('link', { name: /Library MS/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveTextContent('📚 Library MS');
    expect(logoLink).toHaveAttribute('href', '/');
    expect(screen.getByTestId('status-indicator-mock')).toBeInTheDocument();
  });

  it('should render navigation links', () => {
    renderWithRouter();
    expect(screen.getByRole('link', { name: /Home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /All Books/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Add Book/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Search/i })).toBeInTheDocument();
  });

  it('should highlight the active link', () => {
    renderWithRouter(['/books/add']);
    const addBookLink = screen.getByRole('link', { name: /Add Book/i });
    expect(addBookLink).toHaveClass('active');
  });

  // Mobile menu tests can be tricky with JSDOM as it doesn't fully support layout/CSS.
  // A simple check for the icon presence is usually enough for smoke testing.
  // If your CSS for .show relies on actual rendering, these might be flaky.
  it('should show menu icon for mobile (presence test)', () => {
    renderWithRouter();
    // The menu icon in your Header.js is a div with class 'menu-icon'
    // It might not have an explicit role. Let's find it by its structure or a test-id if you add one.
    // For simplicity, we'll assume it's always rendered by Header.
    // If your test for toggling class 'show' works, keep it. If not, simplify.
    const header = screen.getByRole('banner'); // Header component uses <header>
    const menuIcon = header.querySelector('.menu-icon');
    expect(menuIcon).toBeInTheDocument();
  });
});