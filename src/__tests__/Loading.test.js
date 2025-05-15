import React from 'react';
import { render, screen } from '@testing-library/react';
import Loading from '../Loading';

describe('Loading Component', () => {
  it('������ ���������� ��������� �� ���������', () => {
    render(<Loading />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByClassName('spinner')).toBeInTheDocument();
  });

  it('������ ���������� ���������������� ���������', () => {
    const customMessage = '�������� ������...';
    
    render(<Loading message={customMessage} />);
    
    expect(screen.getByText(customMessage)).toBeInTheDocument();
    expect(screen.getByClassName('spinner')).toBeInTheDocument();
  });
});