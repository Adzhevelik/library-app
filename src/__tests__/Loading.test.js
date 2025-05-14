import React from 'react';
import { render, screen } from '@testing-library/react';
import Loading from '../Loading';

describe('Loading Component', () => {
  it('должен отображать сообщение по умолчанию', () => {
    render(<Loading />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByClassName('spinner')).toBeInTheDocument();
  });

  it('должен отображать пользовательское сообщение', () => {
    const customMessage = 'Загрузка данных...';
    
    render(<Loading message={customMessage} />);
    
    expect(screen.getByText(customMessage)).toBeInTheDocument();
    expect(screen.getByClassName('spinner')).toBeInTheDocument();
  });
});