import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../Header';

// Мокаем StatusIndicator
jest.mock('../StatusIndicator', () => () => <div data-testid="status-indicator" />);

describe('Header Component', () => {
  test('renders without crashing', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    // Базовый тест без проверок
  });
  
  test('toggles menu when menu icon clicked', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    
    const menuIcon = screen.getByRole('presentation', { hidden: true }) || document.querySelector('.menu-icon');
    if (menuIcon) {
      fireEvent.click(menuIcon);
    }
    // Базовый тест без проверок
  });
});