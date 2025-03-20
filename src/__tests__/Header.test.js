import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../Header';

describe('Header Component', () => {
  it('should render the logo and navigation links', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText('📚 Library MS')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('All Books')).toBeInTheDocument();
    expect(screen.getByText('Add Book')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });
});
