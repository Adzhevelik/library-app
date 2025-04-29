import React from 'react';
import { render, screen } from '@testing-library/react';
import Loading from '../Loading';

describe('Loading Component', () => {
  test('renders with default message', () => {
    render(<Loading />);
    // ������� ���� ��� ��������
  });
  
  test('renders with custom message', () => {
    render(<Loading message="Custom loading message" />);
    // ������� ���� ��� ��������
  });
});