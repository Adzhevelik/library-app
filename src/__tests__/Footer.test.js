import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer Component', () => {
  test('renders footer with copyright and author info', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear} Library Management System. Made by Dzhevelik Anastasiia and Adriyanova Victoria.`)).toBeInTheDocument();
    expect(screen.getByText(/DevOps Laboratory Work/i)).toBeInTheDocument();
  });
});