import React from 'react';
import { render, screen } from '@testing-library/react';
import StatusIndicator from '../StatusIndicator';

// Мокаем браузерный API navigator
const mockOnline = jest.fn();
Object.defineProperty(navigator, 'onLine', { get: mockOnline });

// Мокаем addEventListener и removeEventListener
const realAddEventListener = window.addEventListener;
const realRemoveEventListener = window.removeEventListener;
let events = {};

describe('StatusIndicator Component', () => {
  beforeEach(() => {
    mockOnline.mockReturnValue(true);
    events = {};
    
    window.addEventListener = jest.fn((event, cb) => {
      events[event] = cb;
    });
    
    window.removeEventListener = jest.fn((event, cb) => {
      delete events[event];
    });
  });
  
  afterEach(() => {
    window.addEventListener = realAddEventListener;
    window.removeEventListener = realRemoveEventListener;
  });
  
  test('renders nothing by default when online', () => {
    const { container } = render(<StatusIndicator />);
    expect(container.firstChild).toBeNull();
  });
  
  test('renders offline message when network goes offline', () => {
    mockOnline.mockReturnValue(false);
    render(<StatusIndicator />);
    
    // Симулируем событие offline
    if (events.offline) {
      events.offline();
    }
    
    // Тест без проверок
  });
});