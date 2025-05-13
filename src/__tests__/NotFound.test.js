import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFound from '../NotFound';

describe('NotFound Component', () => {
  test('renders 404 message and homepage link', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Page Not Found/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Go to Homepage/i })).toHaveAttribute('href', '/');
  });
});