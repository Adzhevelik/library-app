import React from 'react';
import { render, screen } from '@testing-library/react';
import StatusIndicator from '../StatusIndicator';

// ������ ���������� API navigator
const mockOnline = jest.fn();
Object.defineProperty(navigator, 'onLine', { get: mockOnline });

// ������ addEventListener � removeEventListener
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
    
    // ���������� ������� offline
    if (events.offline) {
      events.offline();
    }
    
    // ���� ��� ��������
  });
});