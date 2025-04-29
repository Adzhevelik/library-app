import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Error from '../Error';

describe('Error Component', () => {
  test('renders with default props', () => {
    render(
      <MemoryRouter>
        <Error message="Test error message" />
      </MemoryRouter>
    );
    // Базовый тест без проверок
  });
  
  test('renders with custom props', () => {
    render(
      <MemoryRouter>
        <Error 
          message="Custom error message" 
          backLink="/custom-link" 
          backText="Custom back text" 
        />
      </MemoryRouter>
    );
    // Базовый тест без проверок
  });
});