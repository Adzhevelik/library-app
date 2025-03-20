import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer Component', () => {
  it('should render the footer text', () => {
    render(<Footer />);

    expect(
      screen.getByText(/Library Management System/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/DevOps Laboratory Work/i)).toBeInTheDocument();
  });
});
