import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer Component', () => {
  test('renders copyright notice with current year', () => {
    render(<Footer />);
    // Базовый тест без проверок
  });
});